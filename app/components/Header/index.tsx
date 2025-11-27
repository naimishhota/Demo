"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-indigo-600 text-white font-bold">CU</span>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">ContactUs</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Send messages simply</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600">Home</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600">Contact</Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600">Dashboard</Link>
            <a href="mailto:hello@example.com" className="text-sm inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md">Get in touch</a>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center rounded-md p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link href="/" className="block text-base font-medium text-gray-800 dark:text-gray-100">Home</Link>
            <Link href="/contact" className="block text-base font-medium text-gray-800 dark:text-gray-100">Contact</Link>
            <Link href="/dashboard" className="block text-base font-medium text-gray-800 dark:text-gray-100">Dashboard</Link>
            <a href="mailto:hello@example.com" className="block text-base font-medium text-indigo-600">hello@example.com</a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
