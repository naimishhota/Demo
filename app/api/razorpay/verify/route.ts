import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ error: "Server missing razorpay secret" }, { status: 500 });

    const generated = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid = generated === razorpay_signature;

    const update = valid
      ? { razorpay_payment_id, razorpay_signature, payment_status: "PAID" }
      : { razorpay_payment_id, razorpay_signature, payment_status: "FAILED" };

    // Try updating exhibitors first
    const { data: exhibitorMatch, error: selectExErr } = await supabase
      .from("exhibitors")
      .select("id, stall_id")
      .eq("razorpay_order_id", razorpay_order_id)
      .limit(1)
      .maybeSingle();

    if (selectExErr) return NextResponse.json({ error: selectExErr }, { status: 500 });

    if (exhibitorMatch) {
      const { error: updExErr } = await supabase
        .from("exhibitors")
        .update(update)
        .eq("id", exhibitorMatch.id);

      if (updExErr) return NextResponse.json({ error: updExErr }, { status: 500 });

      // If payment valid and stall chosen, mark stall as booked
      if (valid && exhibitorMatch.stall_id) {
        // Try clearing holds + marking booked; if hold columns don't exist, fallback to updating only is_booked/booked_by
        try {
          const upd = await supabase
            .from("stalls")
            .update({ is_booked: true, booked_by: exhibitorMatch.id, hold_exhibitor_id: null, hold_expires_at: null })
            .eq("id", exhibitorMatch.stall_id);
          if (upd.error) {
            const msg = String(upd.error.message || upd.error);
            if (msg.includes("hold_exhibitor_id") || msg.includes("hold_expires_at")) {
              const upd2 = await supabase
                .from("stalls")
                .update({ is_booked: true, booked_by: exhibitorMatch.id })
                .eq("id", exhibitorMatch.stall_id);
              if (upd2.error) return NextResponse.json({ error: upd2.error }, { status: 500 });
            } else {
              return NextResponse.json({ error: upd.error }, { status: 500 });
            }
          }
        } catch (e: any) {
          const msg = String(e?.message || e);
          if (msg.includes("hold_exhibitor_id") || msg.includes("hold_expires_at")) {
            const upd2 = await supabase
              .from("stalls")
              .update({ is_booked: true, booked_by: exhibitorMatch.id })
              .eq("id", exhibitorMatch.stall_id);
            if (upd2.error) return NextResponse.json({ error: upd2.error }, { status: 500 });
          } else {
            return NextResponse.json({ error: e }, { status: 500 });
          }
        }
      }

      return NextResponse.json({ ok: true, valid, type: "exhibitor" });
    }

    // Fallback: update expovisitors
    const { data: visitorData, error: selectVisErr } = await supabase
      .from("expovisitors")
      .select("id, full_name, email")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    if (selectVisErr) return NextResponse.json({ error: selectVisErr }, { status: 500 });

    const { error } = await supabase
      .from("expovisitors")
      .update(update)
      .eq("razorpay_order_id", razorpay_order_id);

    if (error) return NextResponse.json({ error }, { status: 500 });

    if (valid && visitorData) {
      try {
        // Generate QR Code
        const qrData = razorpay_order_id; // Using order ID as unique identifier
        const qrCodeDataUrl = await QRCode.toDataURL(qrData);

        // Send Email
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: visitorData.email,
          subject: "Your Expo Visitor Pass",
          html: `
            <h1>Welcome to the Expo, ${visitorData.full_name}!</h1>
            <p>Your registration is confirmed.</p>
            <p>Please show the QR code below at the entrance.</p>
            <br>
            <img src="cid:visitor-pass-qr" alt="Visitor Pass QR Code" />
            <br>
            <p>Order ID: ${razorpay_order_id}</p>
          `,
          attachments: [
            {
              filename: "visitor-pass-qr.png",
              path: qrCodeDataUrl,
              cid: "visitor-pass-qr", // same cid value as in the html img src
            },
          ],
        });
      } catch (emailErr) {
        console.error("Failed to send pass email:", emailErr);
        // We don't block the response, but logging is important
      }
    }

    return NextResponse.json({ ok: true, valid, type: "visitor" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
