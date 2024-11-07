export const handleAuthRedirect = (userType) => {
    switch (userType) {
        case 'admin':
        return '/admin/dashboard';
        case 'user':
        return '/calendar';
        default:
        return '/';
    }
};

export const handleRegistrationSuccess = async (response, userType, navigate) => {
    // Salva il token se presente nella risposta
    if (response.data?.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user_type', userType);
    }
    
    // Attendi un po' prima di reindirizzare per mostrare il messaggio di successo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reindirizza in base al tipo di utente
    navigate(handleAuthRedirect(userType));
};

export const handleRegistrationError = (error, setGeneralError, setErrors) => {
    if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
    } else {
        setGeneralError(
            error.response?.data?.message || 
            'Errore durante la registrazione. Riprova più tardi.'
        );
    }
};