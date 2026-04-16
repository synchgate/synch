/**
 * Centralized feature flags configuration.
 * These flags are controlled via environment variables.
 * 
 * Note: Vite environment variables must be prefixed with 'VITE_' to be exposed to the client.
 */

export const FEATURES = {
  // Master toggle for all experimental/upcoming features
  ALLOW_FEATURE: import.meta.env.VITE_ALLOW_FEATURE === "true",
};

// Export individual flags for easier importing
export const { ALLOW_FEATURE } = FEATURES;
