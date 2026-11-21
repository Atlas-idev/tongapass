/**
 * Fond d'aurore : quatre halos flous qui dérivent lentement (40 à 60 s) derrière les surfaces
 * de verre, et une trame fine de bureau d'études en haut de page. Décoratif, fixe, sans
 * interaction ; figé si l'utilisateur réduit les animations (voir styles/index.css).
 */
export function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--3" />
      <div className="aurora__blob aurora__blob--4" />
      <div className="aurora__grid" />
    </div>
  );
}
