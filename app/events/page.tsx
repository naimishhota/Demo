"use client";

import { useState, useEffect } from "react";
import { EventWithTickets } from "../type/events";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import Hero from "@/app/components/Hero";
import axios from "axios";

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithTickets[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithTickets[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchName, searchDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/events");
      setEvents(data.events || []);
      setError("");
    } catch (err) {
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by name
    if (searchName.trim()) {
      filtered = filtered.filter((event) =>
        event.event_name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by date
    if (searchDate) {
      filtered = filtered.filter((event) => event.event_date === searchDate);
    }

    setFilteredEvents(filtered);
  };

  const handleClearFilters = () => {
    setSearchName("");
    setSearchDate("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero 
        title="Upcoming Events" 
        description="Discover and book tickets for the latest events."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <EventFilters
          searchName={searchName}
          searchDate={searchDate}
          onSearchNameChange={setSearchName}
          onSearchDateChange={setSearchDate}
          onClearFilters={handleClearFilters}
        />

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No events found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchName || searchDate
                ? "Try adjusting your filters to find more events"
                : "Check back later for upcoming events"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
