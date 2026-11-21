import type { PointerEvent } from 'react';

/**
 * Halo qui suit le pointeur (classe .spotlight) : pose --mx / --my sur l'élément survolé.
 * À répandre sur un conteneur : onPointerMove={trackSpotlight}.
 */
export function trackSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  target.style.setProperty('--my', `${event.clientY - rect.top}px`);
}
