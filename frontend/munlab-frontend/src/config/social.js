export const socialConfig = {
    google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile'
    },
    facebook: {
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        version: 'v18.0'
    }
};