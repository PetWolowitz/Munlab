export const validateField = (name, value) => {
    switch (name) {
      case 'username':
        // Almeno 3 caratteri, solo lettere, numeri e underscore
        if (!value.match(/^[a-zA-Z0-9_]{3,20}$/)) {
          return 'Username deve contenere tra 3 e 20 caratteri (lettere, numeri e underscore)';
        }
        break;
  
      case 'password':
        // Almeno 8 caratteri, una maiuscola, una minuscola, un numero
        if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)) {
          return 'La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola e un numero';
        }
        break;
  
      case 'email':
        // Validazione email
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          return 'Inserisci un indirizzo email valido';
        }
        break;
  
      case 'firstName':
      case 'lastName':
        // Almeno 2 caratteri, solo lettere
        if (!value.match(/^[a-zA-ZÀ-ÿ\s]{2,}$/)) {
          return 'Inserisci un nome valido (almeno 2 caratteri, solo lettere)';
        }
        break;
  
      case 'employeeId':
        // ID dipendente: 6 caratteri alfanumerici
        if (!value.match(/^[A-Z0-9]{6}$/)) {
          return 'ID dipendente deve contenere 6 caratteri alfanumerici';
        }
        break;
  
      default:
        return '';
    }
    return '';
  };
  
  export const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'Le password non coincidono';
    }
    return '';
  };