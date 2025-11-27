import React from "react";
import SpeakerCard from "./SpeakerCard";
import { SPEAKERS } from "../../../lib/data";

export default function Speakers() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Our Speakers</h2>
          <p className="mt-2 text-sm text-gray-600">Hear from the brightest minds in the industry.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SPEAKERS.map((s) => (
            <SpeakerCard key={s.id} speaker={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
