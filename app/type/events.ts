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
