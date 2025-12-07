"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface BookingDetailsModalProps {
  booking: any;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (booking) {
      generateQRCode();
    }
  }, [booking]);

  const generateQRCode = async () => {
    try {
      const qrData = `BOOKING:${booking.id}`;
      const qrUrl = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error("QR code generation error:", error);
    }
  };

  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      case "REFUNDED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Reference */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Reference</h3>
            <p className="font-mono text-sm text-gray-600">{booking.id}</p>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.payment_status)}`}>
              {booking.payment_status}
            </span>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Event Name:</span>
                <span className="font-semibold text-gray-900">{booking.event_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Venue:</span>
                <span className="font-semibold text-gray-900">{booking.venue}</span>
              </div>
              {booking.event_date && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(booking.event_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ticket Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket Type:</span>
                <span className="font-semibold text-gray-900">{booking.ticket_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold text-gray-900">{booking.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Ticket:</span>
                <span className="font-semibold text-gray-900">₹{booking.ticket_price}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-900 font-bold">Total Amount:</span>
                <span className="font-bold text-blue-600">₹{booking.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Details</h3>
            <div className="space-y-2 text-sm">
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              {booking.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-xs text-gray-900">{booking.razorpay_payment_id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(booking.created_at).toLocaleString()}
                </span>
              </div>
              {booking.cancelled_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(booking.cancelled_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          {qrCodeUrl && booking.payment_status === "PAID" && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking QR Code</h3>
              <div className="inline-block bg-white p-4 rounded-lg border-2 border-gray-200">
                <Image src={qrCodeUrl} alt="Booking QR Code" width={200} height={200} />
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
