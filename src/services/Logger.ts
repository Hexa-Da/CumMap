/**
 * Service de logging simple pour l'application
 */
class Logger {
  log(...args: unknown[]) {
    // Toujours logger en développement, utiliser import.meta.env.MODE pour Vite
    if (import.meta.env.MODE !== 'production' || import.meta.env.DEV) {
      console.log(...args);
    }
  }

  warn(...args: unknown[]) {
    // Toujours logger les warnings
    console.warn(...args);
  }

  error(...args: unknown[]) {
    // Toujours logger les erreurs
    console.error(...args);
  }
}

export default new Logger();
