// Funzione per sanitizzare gli input e prevenire XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 255);
};

// Funzione per validare il formato dell'input
export const validateInput = (input, type = 'text') => {
  if (!input) return false;
  
  switch (type) {
    case 'username':
      return /^[a-zA-Z0-9@._-]{3,50}$/.test(input);
    case 'password':
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(input);
    default:
      return true;
  }
};