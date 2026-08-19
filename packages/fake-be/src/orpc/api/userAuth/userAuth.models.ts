import { z } from "zod";

export const AuthnTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export const UserAuthPasswordLoginRequestSchema = z.object({
  email: z
    .email("Invalid email")
    .min(1, "Email is required")
    .transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1, "Password is required"),
});

export const UserAuthPasswordRegisterRequestSchema = z.object({
  email: z
    .email("Invalid email")
    .min(1, "Email is required")
    .transform((value) => value.toLowerCase().trim()),
  password: z.string().min(12, "Password must be at least 12 characters"),
  name: z.string().optional(),
});

export const AuthnTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const UserAuthEmailGenerateRequestSchema = z.object({
  email: z.email("Invalid email").transform((value) => value.toLowerCase().trim()),
});

export const UserAuthMagicConsumeRequestSchema = z.object({
  code: z.string(),
});

export const StatusResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  code: z.string(),
});

export type AuthTokens = z.infer<typeof AuthnTokenResponseSchema>;
