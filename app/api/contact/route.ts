import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabase.from("contact_form").insert({
    full_name: body.full_name,
    email: body.email,
    message: body.message,
  });

  if (error) return NextResponse.json({ error }, { status: 400 });

  // Send emails
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to Admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form Submission from ${body.full_name}`,
      html: `
        <h1>New Contact Message</h1>
        <p><strong>Name:</strong> ${body.full_name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
      `,
    });

    // Email to User
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: body.email,
      subject: "Thank you for contacting us",
      html: `
        <h1>Thank you for reaching out!</h1>
        <p>Hi ${body.full_name},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <br>
        <p>Best regards,</p>
        <p>The Team</p>
      `,
    });

  } catch (emailError) {
    console.error("Error sending email:", emailError);
    // We don't fail the request if email fails, as DB save was successful
    // But we could return a warning if needed.
  }

  return NextResponse.json({ success: true });
}
