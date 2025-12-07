export interface Event {
  id: string;
  event_name: string;
  organizer: string;
  description?: string;
  chief_guests: string[];
  speakers: string[];
  event_date: string;
  event_time: string;
  venue: string;
  address?: string;
  image_urls: string[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventTicket {
  id?: string;
  event_id?: string;
  ticket_name: string;
  price: number;
  available_quantity: number;
  created_at?: string;
}

export interface CreateEventFormData {
  // Step 1 - General Information
  event_name: string;
  organizer: string;
  description: string;
  chief_guests: string[];
  speakers: string[];
  
  // Step 2 - Date & Location
  event_date: string;
  event_time: string;
  venue: string;
  address: string;
  
  // Step 3 - Media Upload
  images: File[];
  imagePreviewUrls: string[]; // For preview before upload
  
  // Step 4 - Tickets
  tickets: EventTicket[];
}

export interface EventWithTickets extends Event {
  tickets: EventTicket[];
}

// Event Booking Types
export interface EventBooking {
  id: string;
  event_id: string;
  ticket_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  quantity: number;
  total_amount: number;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  event_id: string;
  ticket_id: string;
  quantity: number;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export interface CreateBookingOrderRequest {
  event_id: string;
  ticket_id: string;
  quantity: number;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export interface BookingVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface BookingWithDetails extends EventBooking {
  event: Event;
  ticket: EventTicket;
}

