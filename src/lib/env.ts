export const env = {
  instantDbAppId: import.meta.env.VITE_INSTANTDB_APP_ID,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleClientName: import.meta.env.VITE_GOOGLE_CLIENT_NAME,
};

if (!env.instantDbAppId || !env.googleClientId || !env.googleClientName) {
  throw new Error('Missing required environment variables');
}
