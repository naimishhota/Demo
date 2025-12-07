"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingWithDetails } from "@/app/type/events";
import axios from "axios";
import QRCode from "qrcode";
import Image from "next/image";

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchBooking(params.id as string);
    }
  }, [params.id]);

  const fetchBooking = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/bookings/${id}`);
      setBooking(data.booking);
      
      // Generate QR code
      const qrData = `BOOKING:${id}`;
      const qrUrl = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qrUrl);
      
      setError("");
    } catch (err) {
      setError("Failed to load booking details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error || "Booking not found"}</p>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isPaid = booking.payment_status === "PAID";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Message */}
        {isPaid && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
            <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
            <p className="text-green-700">Your tickets have been successfully booked.</p>
          </div>
        )}

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold">Booking Confirmation</h2>
            <p className="text-blue-100 mt-1">Reference: {booking.id}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Event Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Event Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Name:</span>
                  <span className="font-semibold text-gray-900">{(booking as any).events?.event_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate((booking as any).events?.event_date)} at {(booking as any).events?.event_time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-semibold text-gray-900">{(booking as any).events?.venue}</span>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Ticket Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket Type:</span>
                  <span className="font-semibold text-gray-900">{(booking as any).event_tickets?.ticket_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold text-gray-900">{booking.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Ticket:</span>
                  <span className="font-semibold text-gray-900">₹{(booking as any).event_tickets?.price}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-900 font-bold">Total Amount:</span>
                  <span className="font-bold text-blue-600">₹{booking.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900">{booking.user_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">{booking.user_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-900">{booking.user_phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-semibold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {booking.payment_status}
                  </span>
                </div>
                {booking.razorpay_payment_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-sm text-gray-900">{booking.razorpay_payment_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(booking.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && isPaid && (
              <div className="border-t pt-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Your Ticket QR Code</h3>
                <div className="inline-block bg-white p-4 rounded-lg border-2 border-gray-200">
                  <Image src={qrCodeUrl} alt="Booking QR Code" width={200} height={200} />
                </div>
                <p className="text-sm text-gray-600 mt-2">Present this QR code at the event entrance</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Print Confirmation
          </button>
          <button
            onClick={() => router.push("/events")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Browse More Events
          </button>
        </div>
      </div>
    </div>
  );
}
