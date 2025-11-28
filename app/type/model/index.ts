export interface IContactForm {
	full_name: string;
	email: string;
	message: string;
}

export interface IVisitorForm {
	full_name: string;
	email: string;
	phone: string;
	amount: number;
}

export interface IExhibitorForm {
	company_name: string;
	contact_person: string;
	email: string;
	phone: string;
	domain: string;
	stall_id: string;
	stall_type: string;
	amount: number;
}

// Add other shared interfaces/types here and re-export from this module

