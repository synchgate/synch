import { api } from "../lib/api";

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  contact_me: boolean;
}

export const contactService = {
  submitContact: async (data: ContactPayload) => {
    const response = await api.post("/communications/contact/", data);
    return response.data;
  },
};
