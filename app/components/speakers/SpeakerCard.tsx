import React from "react";
import Link from "next/link";

type Speaker = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

export default function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-48 w-full bg-gray-100">
        <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{speaker.name}</h3>
        <div className="mt-1 text-sm text-indigo-600">
          <Link href="#">{speaker.role}</Link>
        </div>

        <p className="mt-4 text-sm text-gray-600 line-clamp-3 max-h-20 overflow-hidden">{speaker.bio}</p>

        <div className="mt-6">
          <Link
            href={`/speakers/${speaker.id}`}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
