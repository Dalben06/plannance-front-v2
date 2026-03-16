const requiredEnv = ['VITE_API_BASE_URL'] as const;

for (const key of requiredEnv) {
    if (!import.meta.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const env = {
    appName: import.meta.env.VITE_APP_NAME ?? 'Plannance',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true'
};

export const features = {
    googleAuth: import.meta.env.VITE_GOOGLE_CLIENT_ID || null
};
