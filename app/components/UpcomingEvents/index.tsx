"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import EventCard from "../EventCard";
import { EventWithTickets } from "@/app/type/events";

export default function UpcomingEvents() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const response = await axios.get("/api/events?limit=3");
      return response.data.events as EventWithTickets[];
    },
  });

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Upcoming Events
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Don't miss out on our exciting events
            </p>
          </div>
          <Link
            href="/events"
            className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
          >
            View All Events
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading events...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Failed to load events. Please try again later.
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No upcoming events at the moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
