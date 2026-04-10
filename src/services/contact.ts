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

export const contactService = {
  submitContact: async (data: ContactPayload) => {
    const response = await api.post("/communications/contact/", data);
    return response.data;
  },
  submitDemoRequest: async (data: DemoPayload) => {
    const response = await api.post("/communications/demo-sessions/", data);
    return response.data;
  },
};
