"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user, role, signOut } = useAuth();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setShowRegister(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">RCRB EXPO</span>

              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600">Home</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600">Contact</Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowRegister((v) => !v)}
                aria-expanded={showRegister}
                className="text-sm inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-md"
              >
                REGISTER
                <svg className="ml-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {showRegister ? (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-purple-700 text-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link href="/register/visitor" className="block px-4 py-2 text-sm hover:bg-purple-800">Register as a Visitor</Link>
                    <Link href="/register/exhibitor" className="block px-4 py-2 text-sm hover:bg-purple-800">Register as a Exhibitor</Link>
                  </div>
                </div>
              ) : null}
            </div>

            {role === "admin" && (
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600">Dashboard</Link>
            )}

            {user ? (
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600">
                Login
              </Link>
            )}

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
            <div>
              <button onClick={() => setShowRegister((v) => !v)} className="w-full text-left block text-base font-medium text-gray-800 dark:text-gray-100">Register</button>
              {showRegister ? (
                <div className="mt-2 pl-3 space-y-1">
                  <Link href="/register/visitor" className="block text-sm font-medium text-gray-700 dark:text-gray-100">Register as a Visitor</Link>
                  <Link href="/register/exhibitor" className="block text-sm font-medium text-gray-700 dark:text-gray-100">Register as a Exhibitor</Link>
                </div>
              ) : null}
            </div>
            {role === "admin" && (
              <Link href="/dashboard" className="block text-base font-medium text-gray-800 dark:text-gray-100">Dashboard</Link>
            )}
            {user ? (
              <button onClick={() => signOut()} className="block w-full text-left text-base font-medium text-red-600">Logout</button>
            ) : (
              <Link href="/login" className="block text-base font-medium text-indigo-600">Login</Link>
            )}
            <a href="mailto:hello@example.com" className="block text-base font-medium text-indigo-600">hello@example.com</a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
