"use client";

import React, { useState } from "react";
import { CreateEventFormData, EventTicket } from "../type/events";

interface CreateEventWizardProps {
  onSubmit: (data: CreateEventFormData) => Promise<void>;
  onCancel: () => void;
}

export default function CreateEventWizard({ onSubmit, onCancel }: CreateEventWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<CreateEventFormData>({
    event_name: "",
    organizer: "",
    description: "",
    chief_guests: [""],
    speakers: [""],
    event_date: "",
    event_time: "",
    venue: "",
    address: "",
    images: [],
    imagePreviewUrls: [],
    tickets: [{ ticket_name: "", price: 0, available_quantity: 0 }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 validation
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.event_name.trim()) {
      newErrors.event_name = "Event name is required";
    }
    if (!formData.organizer.trim()) {
      newErrors.organizer = "Organizer is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 validation
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.event_date) {
      newErrors.event_date = "Event date is required";
    }
    if (!formData.event_time) {
      newErrors.event_time = "Event time is required";
    }
    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4 validation
  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    formData.tickets.forEach((ticket, index) => {
      if (!ticket.ticket_name.trim()) {
        newErrors[`ticket_name_${index}`] = "Ticket name is required";
      }
      if (ticket.price < 0) {
        newErrors[`ticket_price_${index}`] = "Price must be positive";
      }
      if (ticket.available_quantity < 0) {
        newErrors[`ticket_quantity_${index}`] = "Quantity must be positive";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 4) {
      isValid = validateStep4();
    }
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic array handlers
  const addChiefGuest = () => {
    setFormData({ ...formData, chief_guests: [...formData.chief_guests, ""] });
  };

  const removeChiefGuest = (index: number) => {
    const newGuests = formData.chief_guests.filter((_, i) => i !== index);
    setFormData({ ...formData, chief_guests: newGuests.length ? newGuests : [""] });
  };

  const updateChiefGuest = (index: number, value: string) => {
    const newGuests = [...formData.chief_guests];
    newGuests[index] = value;
    setFormData({ ...formData, chief_guests: newGuests });
  };

  const addSpeaker = () => {
    setFormData({ ...formData, speakers: [...formData.speakers, ""] });
  };

  const removeSpeaker = (index: number) => {
    const newSpeakers = formData.speakers.filter((_, i) => i !== index);
    setFormData({ ...formData, speakers: newSpeakers.length ? newSpeakers : [""] });
  };

  const updateSpeaker = (index: number, value: string) => {
    const newSpeakers = [...formData.speakers];
    newSpeakers[index] = value;
    setFormData({ ...formData, speakers: newSpeakers });
  };

  // Image handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...formData.images, ...files];
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    const allPreviewUrls = [...formData.imagePreviewUrls, ...newPreviewUrls];
    
    setFormData({
      ...formData,
      images: newImages,
      imagePreviewUrls: allPreviewUrls,
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = formData.imagePreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(formData.imagePreviewUrls[index]);
    
    setFormData({
      ...formData,
      images: newImages,
      imagePreviewUrls: newPreviewUrls,
    });
  };

  // Ticket handlers
  const addTicket = () => {
    setFormData({
      ...formData,
      tickets: [...formData.tickets, { ticket_name: "", price: 0, available_quantity: 0 }],
    });
  };

  const removeTicket = (index: number) => {
    const newTickets = formData.tickets.filter((_, i) => i !== index);
    setFormData({ ...formData, tickets: newTickets.length ? newTickets : [{ ticket_name: "", price: 0, available_quantity: 0 }] });
  };

  const updateTicket = (index: number, field: keyof EventTicket, value: string | number) => {
    const newTickets = [...formData.tickets];
    newTickets[index] = { ...newTickets[index], [field]: value };
    setFormData({ ...formData, tickets: newTickets });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <button
              onClick={onCancel}
              className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Event</h1>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {step}
                  </div>
                  <div className="mt-2 text-xs text-center text-gray-600 dark:text-gray-400">
                    {step === 1 && "General"}
                    {step === 2 && "Location & Date"}
                    {step === 3 && "Media"}
                    {step === 4 && "Tickets"}
                  </div>
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step
                        ? "bg-black dark:bg-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {/* Step 1 - General Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                General Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter event name"
                />
                {errors.event_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.event_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organizer *
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter organizer name"
                />
                {errors.organizer && (
                  <p className="mt-1 text-sm text-red-600">{errors.organizer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter event description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chief Guests
                </label>
                {formData.chief_guests.map((guest, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={guest}
                      onChange={(e) => updateChiefGuest(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter chief guest name"
                    />
                    {formData.chief_guests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChiefGuest(index)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addChiefGuest}
                  className="mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Add Chief Guest
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Speakers
                </label>
                {formData.speakers.map((speaker, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={speaker}
                      onChange={(e) => updateSpeaker(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter speaker name"
                    />
                    {formData.speakers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpeaker(index)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpeaker}
                  className="mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  + Add Speaker
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - Date & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Date & Location
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.event_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.event_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Time *
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {errors.event_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.event_time}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter venue name"
                />
                {errors.venue && (
                  <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          )}

          {/* Step 3 - Media Upload */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Media Upload
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Event Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You can upload multiple images (JPEG, PNG, WebP)
                </p>
              </div>

              {/* Image Previews */}
              {formData.imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4 - Tickets */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tickets
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Limit
                      </th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.tickets.map((ticket, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={ticket.ticket_name}
                            onChange={(e) => updateTicket(index, "ticket_name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="VIP"
                          />
                          {errors[`ticket_name_${index}`] && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors[`ticket_name_${index}`]}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => updateTicket(index, "price", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="100"
                            min="0"
                          />
                          {errors[`ticket_price_${index}`] && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors[`ticket_price_${index}`]}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={ticket.available_quantity}
                            onChange={(e) =>
                              updateTicket(index, "available_quantity", parseInt(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="25"
                            min="0"
                          />
                          {errors[`ticket_quantity_${index}`] && (
                            <p className="mt-1 text-xs text-red-600">
                              {errors[`ticket_quantity_${index}`]}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {formData.tickets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTicket(index)}
                              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={addTicket}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                + Add Ticket Type
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
