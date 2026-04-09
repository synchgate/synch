import { api } from "../lib/api";

export interface RegisterPayload {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  business_name: string;
  business_phone: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  purpose: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  new_password: string;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    const response = await api.post("/accounts/auth/register/", data);
    return response.data;
  },
  login: async (data: LoginPayload) => {
    const response = await api.post("/accounts/auth/login/", data);
    return response.data;
  },
  forgotPassword: async (data: ForgotPasswordPayload) => {
    const response = await api.post("/accounts/auth/forgot-password/", data);
    return response.data;
  },
  verifyOtp: async (data: VerifyOtpPayload) => {
    const response = await api.post("/accounts/auth/verify-otp/", data);
    return response.data;
  },
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await api.post("/accounts/auth/reset-password/", data);
    return response.data;
  },
};
