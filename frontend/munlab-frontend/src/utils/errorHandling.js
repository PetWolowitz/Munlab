// src/utils/errorHandling.js
export const socialLoginErrors = {
    // Errori Google
    'popup_closed_by_user': 'Login annullato. Riprova.',
    'access_denied': 'Accesso negato. Verifica le autorizzazioni.',
    'immediate_failed': 'Login automatico fallito. Riprova.',
    
    // Errori Facebook
    'auth_cancelled': 'Login annullato. Riprova.',
    'auth_failed': 'Autenticazione fallita. Riprova.',
    
    // Errori generici
    'network_error': 'Errore di connessione. Verifica la tua connessione internet.',
    'invalid_token': 'Token non valido. Riprova ad accedere.',
    'server_error': 'Errore del server. Riprova più tardi.'
};

export const handleSocialLoginError = (error, provider) => {
    console.error(`${provider} login error:`, error);
    
    // Determina il tipo di errore
    const errorCode = error.error || error.code || 'unknown_error';
    
    // Restituisci un messaggio di errore user-friendly
    return socialLoginErrors[errorCode] || 'Si è verificato un errore durante il login. Riprova.';
};