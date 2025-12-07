import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BookingFormData } from "../type/events";

interface UseEventBookingOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useEventBooking = (options?: UseEventBookingOptions) => {
  const { onSuccess, onError } = options || {};

  return useMutation({
    mutationFn: async (formData: BookingFormData) => {
      // 1. Create Razorpay Order
      const { data: orderData } = await axios.post("/api/bookings/create-order", formData);
      const { order, key_id, booking_id, event_name } = orderData;

      // 2. Load Razorpay Script
      await loadRazorpayScript();

      // 3. Open Razorpay Checkout
      return new Promise((resolve, reject) => {
        const rzpOptions: any = {
          key: key_id,
          amount: order.amount,
          currency: order.currency,
          name: "Event Booking",
          description: `Booking for ${event_name}`,
          order_id: order.id,
          handler: async function (response: any) {
            try {
              // 4. Verify Payment
              const { data: verifyData } = await axios.post("/api/bookings/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyData.valid) {
                resolve({ ...verifyData, booking_id: verifyData.booking_id });
              } else {
                reject(new Error("Payment verification failed"));
              }
            } catch (err) {
              reject(err);
            }
          },
          prefill: {
            name: formData.user_name,
            email: formData.user_email,
            contact: formData.user_phone,
          },
          notes: {
            booking_id,
          },
          theme: { color: "#2563eb" },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled by user"));
            },
          },
        };

        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.open();
      });
    },
    onSuccess,
    onError,
  });
};

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Razorpay SDK failed to load."));
    document.body.appendChild(script);
  });
}
