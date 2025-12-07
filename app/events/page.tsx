"use client";

import { useState, useEffect } from "react";
import { EventWithTickets } from "../type/events";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
          <p className="text-gray-600">Browse and book tickets for our exciting events</p>
        </div>

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
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">
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
