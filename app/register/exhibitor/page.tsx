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

      <div className="flex items-start justify-center p-6 -mt-20 relative z-10">
        <div className="w-full max-w-6xl flex gap-6">
          {/* Pre-Registration Info Section */}
          <div className="w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">Pre-Registration Info</h2>
            
            <ol className="space-y-2 mb-6 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
              <li>Pre-registration is free.</li>
              <li>On-spot registration is chargeable at ₹500 per registrant.</li>
              <li>Last Date of Registration 15th July 2025.</li>
            </ol>

            <hr className="border-gray-300 dark:border-gray-600 my-4" />

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Show Dates</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Dates –</span> 16th & 17th July 2025
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Venue –</span> Pragati Maidan, Delhi
              </p>
            </div>

            <hr className="border-gray-300 dark:border-gray-600 my-4" />

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Rules & Regulations</h3>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                <li>This Trade show is strictly open for professional trade visitor and corporate buyers only.</li>
                <li>This is a B2B Trade show General public, students and individual below 18 years of age will not be permitted entry.</li>
              </ol>
            </div>
          </div>

          {/* Registration Form */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Company name<span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.company_name}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    placeholder="Company Name"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Contact person<span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.contact_person}
                    onChange={(e) => handleChange("contact_person", e.target.value)}
                    placeholder="Contact Person"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Phone<span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="Mobile Number"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Domain
                  </label>
                  <input
                    value={form.domain}
                    onChange={(e) => handleChange("domain", e.target.value)}
                    placeholder="Domain"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Stall Type (optional)
                  </label>
                  <select
                    value={form.stall_type}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, stall_type: e.target.value, stall_id: "" }));
                    }}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-- Select stall type (optional) --</option>
                    {Array.from(new Set(stalls.map((s: any) => s.stall_type))).map((t) => (
                      <option key={t as string} value={t as string}>{t as string}</option>
                    ))}
                  </select>
                </div>
              </div>

              {form.stall_type ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Available stalls ({form.stall_type})
                  </label>
                  <select
                    value={form.stall_id}
                    onChange={(e) => handleChange("stall_id", e.target.value)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-- Choose stall --</option>
                    {stalls.filter((s: any) => s.stall_type === form.stall_type).map((s: any) => (
                      <option key={s.id} value={s.id}>{s.stall_no} — ₹{s.price}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Amount (INR)<span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.amount || ""}
                  onChange={(e) => handleChange("amount", Number(e.target.value))}
                  readOnly={!!form.stall_id}
                  placeholder="0.00"
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                />
              </div>

              <div className="pt-4">
                <button
                  disabled={mutation.isPending}
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-purple-700 hover:bg-purple-800 disabled:opacity-60 px-6 py-3 text-sm font-medium text-white transition-colors"
                >
                  {mutation.isPending ? "Processing..." : "Pay & Register"}
                </button>
              </div>
            </form>

            {message ? (
              <div className="mt-4 p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-sm text-green-700 dark:text-green-300">
                {message}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
