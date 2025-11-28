"use client";

import { useState, useEffect } from "react";
import useContactMutation from "../hooks/useContactMutation";
import { IContactForm } from "../type/model";
import Hero from "../components/Hero";

export default function Contact() {
  const [form, setForm] = useState<IContactForm>({ full_name: "", email: "", message: "" });

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const mutation = useContactMutation({
    onSuccess: () => {
      setForm({ full_name: "", email: "", message: "" });
      setToast({ type: "success", message: "Submitted successfully!" });
    },
    onError: (err: any) => {
      // try to extract a friendly message from axios error
      let msg = "Submission failed. Please try again.";
      try {
        const data = err?.response?.data;
        if (data) {
          if (typeof data.error === "string") msg = data.error;
          else if (data.error && typeof data.error.message === "string") msg = data.error.message;
          else if (typeof data.message === "string") msg = data.message;
          else msg = JSON.stringify(data);
        }
      } catch (e) {
        // fall back
      }
      setToast({ type: "error", message: msg });
    },
  });

  function handleChange<K extends keyof IContactForm>(key: K, value: string) {
    setForm((prev: IContactForm) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero
        title="Contact Us"
        description="Have questions or feedback? Send us a message and we'll get back to you shortly."
      />
      
      <div className="flex items-center justify-center p-6 -mt-20 relative z-10">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Full name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
              <textarea
                placeholder="What would you like to tell us?"
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                rows={5}
                className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={mutation.status === "pending"}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-4 py-2 text-sm font-medium text-white"
              >
                {mutation.status === "pending" ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                <span>{mutation.status === "pending" ? "Sending..." : "Send message"}</span>
              </button>

              <span className="text-sm text-gray-500 dark:text-gray-400">Or email us at <a className="text-indigo-600 dark:text-indigo-400" href="mailto:hello@example.com">hello@example.com</a></span>
            </div>
          </form>
        </div>
      </div>

      {toast ? (
        <div className="fixed right-6 bottom-6 z-50">
          <div
            className={`max-w-xs w-full rounded-lg shadow-lg p-4 text-sm text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}
            role="status"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">{toast.message}</div>
              <button onClick={() => setToast(null)} className="opacity-90 hover:opacity-100">✕</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
