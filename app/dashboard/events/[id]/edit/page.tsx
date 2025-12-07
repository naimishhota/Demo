"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CreateEventWizard from "../../../../components/CreateEventWizard";
import { CreateEventFormData } from "../../../../type/events";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<CreateEventFormData | null>(null);

  useEffect(() => {
    // Fetch event data
    const fetchEvent = async () => {
      try {

        
        if (!eventId) {
          throw new Error("Event ID is missing");
        }
        
        const response = await fetch(`/api/events/${eventId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch event");
        }

        const event = result.event;
        
        // Convert event data to form format
        const formData: CreateEventFormData = {
          event_name: event.event_name,
          organizer: event.organizer,
          description: event.description || "",
          chief_guests: event.chief_guests && event.chief_guests.length > 0 ? event.chief_guests : [""],
          speakers: event.speakers && event.speakers.length > 0 ? event.speakers : [""],
          event_date: event.event_date,
          event_time: event.event_time,
          venue: event.venue,
          address: event.address || "",
          images: [],
          imagePreviewUrls: event.image_urls || [],
          tickets: event.tickets && event.tickets.length > 0 ? event.tickets : [{ ticket_name: "", price: 0, available_quantity: 0 }],
        };

        setInitialData(formData);
      } catch (err) {

        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    } else {
      setError("Event ID is missing from URL");
      setLoading(false);
    }
  }, [eventId, params]);

  const handleSubmit = async (formData: CreateEventFormData) => {
    try {
      setError(null);

      // Get user from localStorage
      const storedUser = localStorage.getItem("app_user");
      const storedRole = localStorage.getItem("app_role");
      
      if (!storedUser || storedRole !== "admin") {
        setError("You must be logged in as an admin to update events");
        router.push("/login");
        return;
      }
      
      const user = JSON.parse(storedUser);

      // Prepare update data
      const updateData = {
        user_email: user.email,
        event_name: formData.event_name,
        organizer: formData.organizer,
        description: formData.description,
        chief_guests: formData.chief_guests.filter(g => g.trim()),
        speakers: formData.speakers.filter(s => s.trim()),
        event_date: formData.event_date,
        event_time: formData.event_time,
        venue: formData.venue,
        address: formData.address,
        tickets: formData.tickets,
        // Note: Image updates not implemented yet - would need separate upload logic
      };

      // Call API
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update event");
      }

      // Success - redirect to events list
      router.push("/dashboard/events");
    } catch (err) {

      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/events");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          Loading event...
        </div>
      </div>
    );
  }

  if (error && !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-4">Error</div>
          <div className="text-gray-600 dark:text-gray-400">{error}</div>
          <button
            onClick={() => router.push("/dashboard/events")}
            className="mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      {initialData && (
        <CreateEventWizard 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          initialData={initialData}
          isEditMode={true}
        />
      )}
    </div>
  );
}
