"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";

export default function Dashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    visitors: 0,
    exhibitors: 0,
    stallsByType: {} as Record<string, number>,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, role, authLoading, router]);

  useEffect(() => {
    async function fetchStats() {
      if (!user || role !== "admin") return; // Don't fetch if not authorized

      try {
        // 1. Total Visitors
        const { count: visitorCount } = await supabase
          .from("expovisitors")
          .select("*", { count: "exact", head: true });

        // 2. Total Exhibitors
        const { count: exhibitorCount } = await supabase
          .from("exhibitors")
          .select("*", { count: "exact", head: true });

        // 3. Booked Stalls by Type
        const { data: stalls } = await supabase
          .from("stalls")
          .select("stall_type")
          .eq("is_booked", true);

        const stallsByType: Record<string, number> = {};
        if (stalls) {
          stalls.forEach((stall) => {
            const type = stall.stall_type || "Unknown";
            stallsByType[type] = (stallsByType[type] || 0) + 1;
          });
        }

        setStats({
          visitors: visitorCount || 0,
          exhibitors: exhibitorCount || 0,
          stallsByType,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    }

    if (!authLoading && user && role === "admin") {
      fetchStats();
    }
  }, [authLoading, user, role]);

  if (authLoading || (user && role === "admin" && statsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero title="Admin Dashboard" description="Manage and monitor your expo statistics" />
      
      <main className="max-w-5xl mx-auto py-12 px-4">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Visitors Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-l-4 border-indigo-500">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Visitors</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.visitors}</p>
        </div>

        {/* Exhibitors Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-l-4 border-purple-500">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Exhibitors</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.exhibitors}</p>
        </div>

        {/* Stalls by Type Cards */}
        {Object.entries(stats.stallsByType).map(([type, count]) => (
          <div key={type} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-l-4 border-green-500">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{type} Stalls Booked</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
          </div>
        ))}
      </section>
      </main>
    </div>
  );
}
