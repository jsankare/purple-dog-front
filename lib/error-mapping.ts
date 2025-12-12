export const getErrorMessage = (error: any): string => {
  // Si c'est une erreur string simple
  if (typeof error === 'string') return error;

  // Si c'est une erreur Error JS
  if (error instanceof Error) return error.message;

  // Si c'est une réponse d'erreur de Payload (tableau d'erreurs)
  const message = error?.message || error?.errors?.[0]?.message || 'Une erreur inconnue est survenue';

  // Mapping des messages d'erreur courants (Payload / Backend) vers le français
  const errorMap: Record<string, string> = {
    'Invalid email or password': 'Email ou mot de passe incorrect.',
    'The email address is already in use': 'Cette adresse email est déjà utilisée.',
    'The password must be at least 8 characters': 'Le mot de passe doit contenir au moins 8 caractères.',
    'You must be logged in to perform this action': 'Accès refusé. Veuillez vous connecter.',
    'Forbidden': 'Accès interdit.',
    'Please verify your email': 'Veuillez vérifier votre email avant de vous connecter.',
    'Token invalid or expired': 'Le lien de vérification est invalide ou a expiré.',
  };

  // Recherche de correspondance exacte ou partielle
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) return value;
  }

  return message;
};
