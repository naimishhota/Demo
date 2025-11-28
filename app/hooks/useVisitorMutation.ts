import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { IVisitorForm } from "../type/model";

interface UseVisitorMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useVisitorMutation = (options?: UseVisitorMutationOptions) => {
  const { onSuccess, onError } = options || {};

  return useMutation({
    mutationFn: async (form: IVisitorForm) => {
      // 1. Create Order
      const { data: orderData } = await axios.post("/api/razorpay/order", form);
      const { order, key_id } = orderData;

      // 2. Load Script
      await loadRazorpayScript();

      // 3. Open Checkout
      return new Promise((resolve, reject) => {
        const rzpOptions: any = {
          key: key_id,
          amount: order.amount,
          currency: order.currency,
          name: "Expo Visitors",
          description: `Registration for ${form.full_name}`,
          order_id: order.id,
          handler: async function (response: any) {
            try {
              // 4. Verify Payment
              const { data: verifyData } = await axios.post("/api/razorpay/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyData.valid) {
                resolve(verifyData);
              } else {
                reject(new Error("Payment verification failed"));
              }
            } catch (err) {
              reject(err);
            }
          },
          prefill: { name: form.full_name, email: form.email, contact: form.phone },
          notes: {},
          theme: { color: "#2563eb" },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled"));
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
