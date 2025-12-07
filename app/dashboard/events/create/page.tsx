"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreateEventWizard from "../../../components/CreateEventWizard";
import { CreateEventFormData } from "../../../type/events";

export default function CreateEventPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CreateEventFormData) => {
    try {
      setError(null);

      // Get user from localStorage (set during login)
      const storedUser = localStorage.getItem("app_user");
      const storedRole = localStorage.getItem("app_role");
      
      if (!storedUser || storedRole !== "admin") {
        setError("You must be logged in as an admin to create events");
        router.push("/login");
        return;
      }
      
      const user = JSON.parse(storedUser);

      // Prepare form data for API
      const apiFormData = new FormData();
      
      // Add user email for authentication
      apiFormData.append("user_email", user.email);
      
      // Add event fields
      apiFormData.append("event_name", formData.event_name);
      apiFormData.append("organizer", formData.organizer);
      apiFormData.append("description", formData.description);
      apiFormData.append("chief_guests", JSON.stringify(formData.chief_guests.filter(g => g.trim())));
      apiFormData.append("speakers", JSON.stringify(formData.speakers.filter(s => s.trim())));
      apiFormData.append("event_date", formData.event_date);
      apiFormData.append("event_time", formData.event_time);
      apiFormData.append("venue", formData.venue);
      apiFormData.append("address", formData.address);
      
      // Add tickets
      apiFormData.append("tickets", JSON.stringify(formData.tickets));
      
      // Add images
      formData.images.forEach((image, index) => {
        apiFormData.append(`image_${index}`, image);
      });

      // Call API
      const response = await fetch("/api/events/create", {
        method: "POST",
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create event");
      }

      // Success - redirect to events list
      router.push("/dashboard/events");
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/events");
  };

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
      <CreateEventWizard onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
