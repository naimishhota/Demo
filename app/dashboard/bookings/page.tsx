"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { 
  ColDef, 
  ModuleRegistry, 
  AllCommunityModule,
  themeQuartz
} from "ag-grid-community";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import BookingDetailsModal from "@/app/components/BookingDetailsModal";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import Hero from "@/app/components/Hero";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface Booking {
  id: string;
  event_name: string;
  user_name: string;
  user_email: string;
  ticket_name: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  created_at: string;
  // ... other fields
}

export default function BookingsDashboard() {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Confirmation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    event_name: "",
    user_email_filter: "",
    start_date: "",
    end_date: "",
    ticket_type: "",
    status: "",
  });

  // Check auth
  useEffect(() => {
    if (!authLoading) {
      if (!user || role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, role, authLoading, router]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("user_email", user.email || ""); // For admin check in API
      
      if (filters.event_name) params.append("event_name", filters.event_name);
      if (filters.user_email_filter) params.append("user_email_filter", filters.user_email_filter);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.ticket_type) params.append("ticket_type", filters.ticket_type);
      if (filters.status) params.append("status", filters.status);

      const { data } = await axios.get(`/api/admin/bookings?${params.toString()}`);
      setBookings(data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    if (user && role === "admin") {
      fetchBookings();
    }
  }, [fetchBookings, user, role]);

  // Actions
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const initiateCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    
    setCancelLoading(true);
    try {
      await axios.post(`/api/admin/bookings/${bookingToCancel.id}/cancel`, {
        user_email: user?.email,
      });
      // Show success toast or notification here if you have one
      fetchBookings(); // Refresh list
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (error: any) {
      console.error("Failed to cancel booking:", error);
      alert(error.response?.data?.error || "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      event_name: "",
      user_email_filter: "",
      start_date: "",
      end_date: "",
      ticket_type: "",
      status: "",
    });
  };

  // Column Definitions
  const colDefs = useMemo<ColDef[]>(() => [
    { field: "event_name", headerName: "Event", filter: true, flex: 1.5 },
    { field: "user_name", headerName: "User", filter: true, flex: 1 },
    { field: "user_email", headerName: "Email", filter: true, flex: 1.5 },
    { field: "ticket_name", headerName: "Ticket", filter: true, flex: 1 },
    { field: "quantity", headerName: "Qty", width: 80 },
    { 
      field: "total_amount", 
      headerName: "Amount", 
      width: 100,
      valueFormatter: (params) => `₹${params.value}`
    },
    { 
      field: "payment_status", 
      headerName: "Status", 
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        let colorClass = "bg-gray-100 text-gray-800";
        if (status === "PAID") colorClass = "bg-green-100 text-green-800";
        else if (status === "PENDING") colorClass = "bg-yellow-100 text-yellow-800";
        else if (status === "FAILED") colorClass = "bg-red-100 text-red-800";
        else if (status === "CANCELLED") colorClass = "bg-gray-100 text-gray-800";
        else if (status === "REFUNDED") colorClass = "bg-blue-100 text-blue-800";
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {status}
          </span>
        );
      }
    },
    { 
      field: "created_at", 
      headerName: "Date", 
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      headerName: "Actions",
      width: 180,
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(params.data)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </button>
          {params.data.payment_status !== "CANCELLED" && params.data.payment_status !== "REFUNDED" && (
            <button
              onClick={() => initiateCancelBooking(params.data)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      )
    }
  ], [user]);

  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user || role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero 
        title="Bookings Management" 
        description="View and manage all event bookings."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <input
              type="text"
              name="event_name"
              placeholder="Event Name"
              value={filters.event_name}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              name="user_email_filter"
              placeholder="User Email"
              value={filters.user_email_filter}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              name="ticket_type"
              placeholder="Ticket Type"
              value={filters.ticket_type}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden h-[600px]">
          <AgGridReact
            rowData={bookings}
            columnDefs={colDefs}
            theme={themeQuartz}
            pagination={true}
            paginationPageSize={20}
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              floatingFilter: true,
              flex: 1,
            }}
            overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading bookings...</span>'
            overlayNoRowsTemplate='<span class="ag-overlay-loading-center">No bookings found</span>'
          />
        </div>
      </div>

      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      <ConfirmationModal
        isOpen={showCancelModal}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone and will initiate a refund if applicable."
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setShowCancelModal(false);
          setBookingToCancel(null);
        }}
        isLoading={cancelLoading}
      />
    </div>
  );
}
