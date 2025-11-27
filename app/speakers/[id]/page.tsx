import React from "react";
import { notFound } from "next/navigation";
import { SPEAKERS } from "../../../lib/data";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const { id } = (await params) as { id: string };
  const speaker = SPEAKERS.find((s) => s.id === id);

  if (!speaker) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-start gap-6">
          <img
            src={speaker?.imageUrl}
            alt={speaker?.name}
            className="w-32 h-32 rounded-full object-cover"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{speaker?.name}</h1>
            <p className="mt-1 text-sm text-indigo-600">{speaker?.role}</p>
            <p className="mt-4 text-gray-700">{speaker?.bio}</p>

            {speaker?.sessions && speaker.sessions.length > 0 && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
                <ul className="mt-2 space-y-2">
                  {speaker.sessions.map((s) => (
                    <li key={s.id} className="text-sm text-gray-600">
                      <span className="font-medium">{s.title}</span>
                      <span className="ml-2 text-xs text-gray-500">{s.time}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
