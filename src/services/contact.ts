import { api } from "../lib/api";

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  contact_me: boolean;
}

export interface DemoPayload {
  name: string;
  email: string;
  phone_number: string;
  company_name: string;
  preferred_date: string;
  message: string;
}

export interface SupportPayload {
  support_type: string;
  subject: string;
  name: string;
  email: string;
  company_name: string;
  preferred_date: string;
  message: string;
}

export const contactService = {
  submitContact: async (data: ContactPayload) => {
    const response = await api.post("/communications/contact/", data);
    return response.data;
  },
  submitDemoRequest: async (data: DemoPayload) => {
    const response = await api.post("/communications/demo-sessions/", data);
    return response.data;
  },
  submitSupportTicket: async (data: SupportPayload) => {
    const response = await api.post("/communications/support/", data);
    return response.data;
  },
};
