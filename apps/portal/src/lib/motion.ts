/**
 * Jetons d'animation partagés : une seule courbe de décélération et trois durées.
 * Les sorties sont plus courtes que les entrées (≈ 65 %) pour que l'interface réponde vite.
 * Équivalents CSS : --duration-fast, --duration-base, --duration-slow, --ease-out.
 */
export const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;

export const DURATION = {
  /** Retour d'état immédiat : survol, sortie d'un élément. */
  fast: 0.13,
  /** Entrée d'un élément, changement de contenu. */
  base: 0.2,
  /** Déplacement sur une distance plus grande : barre de progression, connecteur. */
  slow: 0.32,
} as const;

/** Décalage entre les éléments d'une liste qui apparaissent (30 ms, plafonné). */
export const STAGGER = 0.03;
