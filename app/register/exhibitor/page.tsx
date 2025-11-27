"use client";

import { useState, useEffect } from "react";

export default function ExhibitorRegister() {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [domain, setDomain] = useState("");
  const [stallId, setStallId] = useState("");
  const [stallType, setStallType] = useState("");
  const [amount, setAmount] = useState(0);
  const [stalls, setStalls] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/razorpay/order/exhibitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: companyName, contact_person: contactPerson, email, phone, domain, stall_id: stallId, amount }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        // errBody.error may be a string or an object from Supabase; try to extract a friendly message
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

      await loadRazorpayScript();

      const options: any = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: companyName || "Exhibitor",
        description: `Stall booking for ${companyName}`,
        order_id: order.id,
        handler: async function (response: any) {
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
            setMessage("Payment successful. Stall booked. Thank you!");
          } else {
            setMessage("Payment completed but verification failed. Please contact support.");
          }
          setLoading(false);
        },
        prefill: { name: contactPerson, email, contact: phone },
        notes: {},
        theme: { color: "#7c3aed" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage(err?.message || "Something went wrong");
      setLoading(false);
    }
  }

  // fetch available stalls
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/stalls");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setStalls(data.stalls || []);
      } catch (e) {
        // ignore
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  // update amount when stall selection changes
  useEffect(() => {
    if (!stallId) return setAmount(0);
    const s = stalls.find((x: any) => x.id === stallId);
    if (s) setAmount(Number(s.price));
  }, [stallId, stalls]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Exhibitor Registration</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Company name</label>
            <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contact person</label>
            <input required value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Domain</label>
            <input value={domain} onChange={(e) => setDomain(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Stall Type (optional)</label>
            <select value={stallType} onChange={(e) => { setStallType(e.target.value); setStallId(""); }} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100">
              <option value="">-- Select stall type (optional) --</option>
              {Array.from(new Set(stalls.map((s: any) => s.stall_type))).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {stallType ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Available stalls ({stallType})</label>
              <select value={stallId} onChange={(e) => setStallId(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100">
                <option value="">-- Choose stall --</option>
                {stalls.filter((s: any) => s.stall_type === stallType).map((s: any) => (
                  <option key={s.id} value={s.id}>{s.stall_no} — ₹{s.price}</option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount (INR)</label>
            <input required type="number" step="0.01" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} readOnly={!!stallId} className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100" />
          </div>

          <div className="pt-2">
            <button disabled={loading} type="submit" className="inline-flex items-center gap-2 rounded-md bg-purple-700 hover:bg-purple-800 disabled:opacity-60 px-4 py-2 text-sm font-medium text-white">
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
