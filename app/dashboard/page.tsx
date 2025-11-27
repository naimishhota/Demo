import React from "react";
import Link from "next/link";
import { SPEAKERS } from "../../lib/data";

export default function Dashboard() {
  const total = SPEAKERS.length;
  const upcoming = SPEAKERS.slice(0, 3);

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/" className="text-sm text-indigo-600">Home</Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm text-gray-500">Total Speakers</h2>
          <p className="mt-2 text-2xl font-semibold">{total}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 col-span-2">
          <h2 className="text-sm text-gray-500">Quick Links</h2>
          <div className="mt-3 space-x-3">
            <Link href="/" className="text-indigo-600 text-sm">Home</Link>
            <Link href="/speakers/1" className="text-indigo-600 text-sm">First speaker</Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Speakers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {upcoming.map((s) => (
            <div key={s.id} className="bg-white rounded-lg shadow p-4">
              <img src={s.imageUrl} alt={s.name} className="w-full h-36 object-cover rounded" />
              <h3 className="mt-2 font-medium">{s.name}</h3>
              <p className="text-sm text-gray-500">{s.role}</p>
              <Link href={`/speakers/${s.id}`} className="mt-3 inline-block text-indigo-600 text-sm">View profile</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
