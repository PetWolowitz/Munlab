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

// Mapping degli errori API
const errorMessages = {
    'invalid_credentials': 'Credenziali non valide',
    'user_exists': 'Username o email già in uso',
    'invalid_email': 'Email non valida',
    'weak_password': 'La password non soddisfa i requisiti minimi',
    'server_error': 'Errore del server. Riprova più tardi',
    'network_error': 'Errore di connessione. Verifica la tua connessione internet',
    'unauthorized': 'Non autorizzato. Effettua nuovamente il login',
    'validation_error': 'Errore di validazione. Verifica i dati inseriti'
};

export const handleApiError = (error) => {
    if (error.response) {
        // Errore dal server con risposta
        const statusCode = error.response.status;
        const errorData = error.response.data;
        
        switch (statusCode) {
            case 400:
            return {
                title: 'Errore di Validazione',
                message: errorData.message || 'I dati inseriti non sono validi',
                errors: errorData.errors || {}
            };
            case 401:
            return {
                title: 'Non Autorizzato',
                message: 'Sessione scaduta. Effettua nuovamente il login',
                type: 'auth_error'
            };
            case 403:
            return {
                title: 'Accesso Negato',
                message: 'Non hai i permessi necessari per questa operazione',
                type: 'permission_error'
            };
            case 404:
            return {
                title: 'Non Trovato',
                message: 'La risorsa richiesta non esiste',
                type: 'not_found'
            };
            case 500:
            return {
                title: 'Errore del Server',
                message: 'Si è verificato un errore. Riprova più tardi',
                type: 'server_error'
            };
            default:
            return {
                title: 'Errore',
                message: 'Si è verificato un errore imprevisto',
                type: 'unknown_error'
            };
        }
    } else if (error.request) {
        // Errore di rete
        return {
            title: 'Errore di Connessione',
            message: 'Impossibile contattare il server. Verifica la tua connessione',
            type: 'network_error'
        };
    } else {
        // Errore durante la configurazione della richiesta
        return {
            title: 'Errore',
            message: error.message || 'Si è verificato un errore imprevisto',
            type: 'request_error'
        };
    }
};