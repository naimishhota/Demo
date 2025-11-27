"use client";

import { useEffect } from "react";

export default function RedirectRegister() {
  useEffect(() => {
    // Redirect legacy nested register route to top-level /register
    window.location.replace("/register");
  }, []);

  return <div className="min-h-screen flex items-center justify-center">Redirecting to register...</div>;
}
