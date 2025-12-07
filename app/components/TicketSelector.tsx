"use client";

import { useState } from "react";
import { EventTicket } from "../type/events";

interface TicketSelectorProps {
  tickets: EventTicket[];
  onBookNow: (formData: {
    ticket_id: string;
    quantity: number;
    user_name: string;
    user_email: string;
    user_phone: string;
  }) => void;
  isLoading?: boolean;
}

export default function TicketSelector({ tickets, onBookNow, isLoading }: TicketSelectorProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;
  const maxQuantity = selectedTicket 
    ? Math.min(10, selectedTicket.available_quantity) 
    : 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTicketId || !userName || !userEmail || !userPhone) {
      alert("Please fill in all fields");
      return;
    }

    const formData = {
      ticket_id: selectedTicketId,
      quantity,
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
    };

    console.log("Booking form data:", formData);
    onBookNow(formData);
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-semibold">No tickets available for this event</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ticket Type Selection */}
        <div>
          <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700 mb-2">
            Select Ticket Type
          </label>
          <select
            id="ticketType"
            value={selectedTicketId}
            onChange={(e) => {
              setSelectedTicketId(e.target.value);
              setQuantity(1); // Reset quantity when ticket type changes
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">-- Select Ticket --</option>
            {tickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id} disabled={ticket.available_quantity === 0}>
                {ticket.ticket_name} - ₹{ticket.price} 
                ({ticket.available_quantity} available)
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Selection */}
        {selectedTicket && (
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tickets (Max: {maxQuantity})
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {/* User Details */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="userPhone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Total Price */}
        {selectedTicket && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <button
          type="submit"
          disabled={!selectedTicketId || isLoading || (selectedTicket?.available_quantity === 0)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isLoading ? "Processing..." : "Book Now"}
        </button>
      </form>
    </div>
  );
}
