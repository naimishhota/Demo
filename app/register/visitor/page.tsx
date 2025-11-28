"use client";

import { useState } from "react";
import { IVisitorForm } from "../../type/model";
import { useVisitorMutation } from "../../hooks/useVisitorMutation";
import Hero from "../../components/Hero";

export default function Register() {
  const [form, setForm] = useState<IVisitorForm>({
    full_name: "",
    email: "",
    phone: "",
    amount: 0,
  });
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useVisitorMutation({
    onSuccess: () => {
      setMessage("Payment successful. Thank you for registering!");
      setForm({
        full_name: "",
        email: "",
        phone: "",
        amount: 0,
      });
    },
    onError: (error: any) => {
      setMessage(error.message || "Something went wrong");
    },
  });

  function handleChange<K extends keyof IVisitorForm>(key: K, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    mutation.mutate(form);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero title="Visitor Registration" description="Join us for an unforgettable experience." />

      <div className="flex items-center justify-center p-6 -mt-20 relative z-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full name</label>
              <input
                required
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount (INR)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => handleChange("amount", Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="pt-2">
              <button
                disabled={mutation.isPending}
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-4 py-2 text-sm font-medium text-white"
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
