"use client";

import { useState } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, phone, amount }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        let msg = "Failed to create order";
        if (errBody) {
          if (typeof errBody.error === "string") msg = errBody.error;
          else if (errBody.error && typeof errBody.error.message === "string") msg = errBody.error.message;
          else if (typeof errBody.message === "string") msg = errBody.message;
          else if (errBody.error) msg = JSON.stringify(errBody.error);
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const { order, key_id } = data;

      // load Razorpay script
      await loadRazorpayScript();

      const options: any = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Expo Visitors",
        description: `Registration for ${fullName}`,
        order_id: order.id,
        handler: async function (response: any) {
          // verify signature on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.valid) {
            setMessage("Payment successful. Thank you for registering!");
          } else {
            setMessage("Payment completed but verification failed. Please contact support.");
          }
          setLoading(false);
        },
        prefill: { name: fullName, email, contact: phone },
        notes: {},
        theme: { color: "#2563eb" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage(err?.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Visitor Registration</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full name</label>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone</label>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount (INR)</label>
            <input required type="number" step="0.01" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
          </div>

          <div className="pt-2">
            <button disabled={loading} type="submit" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-4 py-2 text-sm font-medium text-white">
              {loading ? "Processing..." : "Pay & Register"}
            </button>
          </div>
        </form>

        {message ? <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">{message}</div> : null}
      </div>
    </div>
  );
}

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
