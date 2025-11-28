"use client";

import { useState, useEffect } from "react";
import { IExhibitorForm } from "../../type/model";
import { useExhibitorMutation } from "../../hooks/useExhibitorMutation";
import Hero from "../../components/Hero";

export default function ExhibitorRegister() {
  const [form, setForm] = useState<IExhibitorForm>({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    domain: "",
    stall_id: "",
    stall_type: "",
    amount: 0,
  });
  const [stalls, setStalls] = useState<Array<any>>([]);
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useExhibitorMutation({
    onSuccess: () => {
      setMessage("Payment successful. Stall booked. Thank you!");
      setForm({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        domain: "",
        stall_id: "",
        stall_type: "",
        amount: 0,
      });
    },
    onError: (error: any) => {
      setMessage(error.message || "Something went wrong");
    },
  });

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
    if (!form.stall_id) {
      setForm((prev) => ({ ...prev, amount: 0 }));
      return;
    }
    const s = stalls.find((x: any) => x.id === form.stall_id);
    if (s) {
      setForm((prev) => ({ ...prev, amount: Number(s.price) }));
    }
  }, [form.stall_id, stalls]);

  function handleChange<K extends keyof IExhibitorForm>(key: K, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    mutation.mutate(form);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero title="Exhibitor Registration" description="Showcase your products and services to a global audience." />

      <div className="flex items-center justify-center p-6 -mt-20 relative z-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Company name</label>
              <input
                required
                value={form.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contact person</label>
              <input
                required
                value={form.contact_person}
                onChange={(e) => handleChange("contact_person", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone</label>
              <input
                required
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Domain</label>
              <input
                value={form.domain}
                onChange={(e) => handleChange("domain", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Stall Type (optional)</label>
              <select
                value={form.stall_type}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, stall_type: e.target.value, stall_id: "" }));
                }}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              >
                <option value="">-- Select stall type (optional) --</option>
                {Array.from(new Set(stalls.map((s: any) => s.stall_type))).map((t) => (
                  <option key={t as string} value={t as string}>{t as string}</option>
                ))}
              </select>
            </div>

            {form.stall_type ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Available stalls ({form.stall_type})</label>
                <select
                  value={form.stall_id}
                  onChange={(e) => handleChange("stall_id", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
                >
                  <option value="">-- Choose stall --</option>
                  {stalls.filter((s: any) => s.stall_type === form.stall_type).map((s: any) => (
                    <option key={s.id} value={s.id}>{s.stall_no} — ₹{s.price}</option>
                  ))}
                </select>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount (INR)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => handleChange("amount", Number(e.target.value))}
                readOnly={!!form.stall_id}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="pt-2">
              <button
                disabled={mutation.isPending}
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-purple-700 hover:bg-purple-800 disabled:opacity-60 px-4 py-2 text-sm font-medium text-white"
              >
                {mutation.isPending ? "Processing..." : "Pay & Register"}
              </button>
            </div>
          </form>

          {message ? <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">{message}</div> : null}
        </div>
      </div>
    </div>
  );
}
