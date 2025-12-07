"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventWithTickets } from "@/app/type/events";
import TicketSelector from "@/app/components/TicketSelector";
import { useEventBooking } from "@/app/hooks/useEventBooking";
import axios from "axios";
import Image from "next/image";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<EventWithTickets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const eventBooking = useEventBooking({
    onSuccess: (data) => {
      router.push(`/bookings/${data.booking_id}`);
    },
    onError: (error) => {
      alert(error?.response?.data?.error || error.message || "Booking failed. Please try again.");
    },
  });

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string);
    }
  }, [params.id]);

  const fetchEvent = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/events/${id}`);
      setEvent(data.event);
      setError("");
    } catch (err) {
      setError("Failed to load event details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (formData: any) => {
    if (!event) return;
    
    eventBooking.mutate({
      event_id: event.id,
      ...formData,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextImage = () => {
    if (event && event.image_urls.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % event.image_urls.length);
    }
  };

  const prevImage = () => {
    if (event && event.image_urls.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + event.image_urls.length) % event.image_urls.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error || "Event not found"}</p>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/events")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {event.image_urls && event.image_urls.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-96">
                  <Image
                    src={event.image_urls[currentImageIndex]}
                    alt={event.event_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  
                  {event.image_urls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {event.image_urls.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Event Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.event_name}</h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{formatDate(event.event_date)}</p>
                    <p className="text-gray-600">at {event.event_time}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">{event.venue}</p>
                    {event.address && <p className="text-gray-600">{event.address}</p>}
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Organized by {event.organizer}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-line">{event.description || "No description available."}</p>
              </div>

              {event.chief_guests && event.chief_guests.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Chief Guests</h2>
                  <ul className="list-disc list-inside text-gray-700">
                    {event.chief_guests.map((guest, index) => (
                      <li key={index}>{guest}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.speakers && event.speakers.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Speakers</h2>
                  <ul className="list-disc list-inside text-gray-700">
                    {event.speakers.map((speaker, index) => (
                      <li key={index}>{speaker}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Ticket Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TicketSelector
                tickets={event.tickets || []}
                onBookNow={handleBookNow}
                isLoading={eventBooking.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
