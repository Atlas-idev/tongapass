# Charte graphique TongaPass

![Logo TongaPass](logo.svg)

## 1. Le nom

TongaPass associe le malgache *tonga* (« arriver » ; *tonga soa* = « bienvenue ») et l'anglais *pass* (badge, laissez-passer). Le produit remet à chaque arrivant ses accès, les ajuste quand il change de poste et les reprend le jour de son départ.

Promesse : *les accès de vos équipes, de l'arrivée au départ.*

## 2. Principes

TongaPass est un outil de travail quotidien pour les RH, les administrateurs IAM et les auditeurs. L'interface vise la lisibilité et le calme plutôt que l'effet :

- des surfaces pleines, séparées par des bordures fines, sans transparence, flou ni dégradé ;
- une palette chaude et resserrée, du brun expresso à l'ivoire ;
- des couleurs d'état réservées à l'information (accordé, en cours, échec, planifié), toujours doublées d'un libellé ;
- des transitions courtes à l’ouverture d’une page, d’une fenêtre ou lors d’un changement d’étape ;
- les données d'abord : tableaux lisibles, chiffres tabulaires, identifiants en chasse fixe.

## 3. Couleurs

### Palette de marque « café crème »

| Nom | Valeur | Usage |
|---|---|---|
| Expresso | `#4A3A34` | Texte principal (thème clair), survol du bouton principal |
| Cacao | `#77574A` | Marque : bouton principal, logo, liens de marque, élément actif, texte secondaire |
| Caramel | `#A8836C` | Accent : série « départs » du graphique, rappels signés dans le schéma |
| Sable | `#D0AE92` | Bordures de champs ; marque et texte secondaire en thème sombre |
| Crème | `#EBD7BE` | Fonds teintés (navigation active), texte en thème sombre |
| Ivoire | `#F9F2E4` | Fond de page, texte du bouton principal |

### Jetons de l'interface

| Jeton | Clair | Sombre |
|---|---|---|
| Fond de page | `#F9F2E4` | `#1C1613` |
| Surface (panneaux, tableaux) | `#FFFDF9` | `#261E1A` |
| Surface en retrait (en-têtes de tableau) | `#F3E8D6` | `#201915` |
| Texte principal | `#4A3A34` | `#F9F2E4` |
| Texte | `#5E4A41` | `#EBD7BE` |
| Texte secondaire | `#77574A` | `#D0AE92` |
| Bordure | `#EBDCC8` | crème à 10 % |
| Bordure de champ | `#D0AE92` | crème à 22 % |
| Marque | `#77574A` | `#D0AE92` |

### Couleurs d'état

Accordées à la palette, et vérifiées à ≥ 4,5:1 sur le fond de page comme sur leur fond teinté (12 à 14 %) :

| État | Clair | Sombre | Sens |
|---|---|---|---|
| Olive | `#4B6B35` | `#A6C78A` | Accès accordé, conforme, terminé |
| Ardoise | `#3D5C78` | `#A3BED9` | En cours, liens, anneau de focus |
| Brique | `#A23A2A` | `#EE9C8A` | Révocation, échec, écart de droits |
| Ocre | `#86560F` | `#E3B566` | Planifié, droit sensible, exécution partielle |

Séries du graphique : cacao `#77574A` (arrivées) et caramel `#A8836C` (départs) en clair, crème et caramel en sombre. Les deux séries se distinguent par leur luminance, lisible par les personnes daltoniennes, et le graphique propose toujours une vue tableau.

Couleurs des profils d'accès : ce sont des données (stockées en base, choisies par l'administrateur), pas des couleurs de marque. Huit teintes distinctes, toujours accompagnées du nom du profil : indigo `#3B57C2`, ocre `#A25A12`, ravinala `#00876D`, améthyste `#7A4AA8`, latérite `#B3412B`, lagon `#1C7FB0`, litchi `#A63A72`, ardoise `#64708A`.

Les contrastes des écrans sont vérifiés par axe-core.

## 4. Typographie

| Rôle | Police | Pourquoi |
|---|---|---|
| Formulaires, navigation et texte courant | Plus Jakarta Sans (variable) | Lisibilité à l’écran |
| Grands titres et nom sur la fiche d’exemple | Instrument Serif | Titres en romain, deuxième ligne de l’accueil en italique |
| Identifiants, matricules, rôles, empreintes | IBM Plex Mono | Chasse fixe : un identifiant se lit caractère par caractère |

Le texte courant est réglé à 16 px. La taille des titres varie avec la largeur de l’écran. Les colonnes de durées et les indicateurs utilisent des chiffres tabulaires.

Les polices sont auto-hébergées (Fontsource, et embarquées dans le thème Keycloak) : aucune requête vers un CDN tiers. Licence SIL OFL 1.1.

## 5. Logo « le Seuil »

- Une porte en arche entrouverte : le battant gauche en ivoire, le battant droit en sable, légèrement écarté en haut.
- Au centre, une silhouette qui est aussi un trou de serrure : la personne et son accès dans un même signe.
- Tuile cacao `#77574A` aux coins de 7 px, tracés ivoire `#F9F2E4` et sable `#D0AE92`. Aplat, sans dégradé ni reflet.
- Mot-symbole : « Tonga » en expresso, « Pass » en cacao, Plus Jakarta Sans gras.
- Zone de protection : un quart de la largeur de la tuile tout autour. Taille minimale : 16 px (favicon), 120 px pour le logo avec mot-symbole.
- Fichiers : [`logo.svg`](logo.svg), [`banner.svg`](banner.svg), favicon `apps/portal/public/favicon.svg`, thème de connexion `infra/keycloak/themes/tongapass/login/resources/img/logo.svg`, composant `apps/portal/src/components/brand/Logo.tsx`.

## 6. Pictogrammes

Les 55 pictogrammes du portail ont été dessinés pour le produit ([`components/icons`](../../apps/portal/src/components/icons/index.tsx)) ; aucune banque d'icônes ni aucun émoji.

- Grille de 24 px, trait arrondi de 1,75 px, un léger aplat à 16 % de la couleur du texte.
- Chaque forme dit le métier : le journal d'audit est une pile de blocs chaînés, l'intégrité deux maillons, les profils un badge nominatif, une arrivée une silhouette avec un « + ».
- Ils accompagnent toujours un libellé et sont masqués aux lecteurs d'écran (`aria-hidden`).

## 7. Composants

- Barre latérale fixe, collée au bord gauche, séparée du contenu par une bordure. La page active a un fond crème et un trait cacao de 3 px à gauche. Repliable en mode icônes.
- Barre supérieure collée en haut : recherche (Ctrl/⌘ + K), état de la connexion temps réel, activité récente, thème, compte.
- Panneaux : surface pleine, bordure de 1 px, coins de 12 px, ombre à peine perceptible. Menus et fenêtres : même surface, ombre portée nette.
- Boutons : coins de 8 px. Principal en cacao plein, secondaire bordé, tertiaire sans fond.
- Onglets soulignés ; filtres en contrôle segmenté, option choisie en cacao plein.
- Indicateurs clés : une bande de six cases séparées par des filets, libellé au-dessus du chiffre.

## 8. Mouvement

Le mouvement est réduit au strict nécessaire :

| Élément | Animation |
|---|---|
| Fenêtres, menus, palette de commandes | Fondu et léger glissement à l'ouverture (180 ms), fermeture plus rapide |
| Navigation, changement d’étape ou de fiche d’exemple | Translation de 6 px et fondu bref à l’entrée |
| Point d'état « en cours » | Clignement lent de l'opacité |
| Squelettes de chargement | Variation lente de l'opacité |

Pas de compteurs qui défilent, d'apparitions en cascade, de halos, de rebonds ni de fond animé. `prefers-reduced-motion` coupe toutes les animations.

## 9. Ton et rédaction

- Français, phrases courtes, voix active, vocabulaire RH sans jargon technique.
- Les boutons disent ce qu'ils font : « Révoquer les accès », « Appliquer la mobilité », « Planifier l'arrivée », pas « Valider ».
- Les erreurs expliquent quoi faire : « Recopiez l'identifiant hanitra.rakoto pour confirmer ».
- Les états vides disent ce qui se passera : « Les étapes exécutées par n8n s'afficheront ici ».
- Pas d'émoji, pas de point d'exclamation, pas de formule d'accroche.

## 10. Accessibilité (niveau visé : WCAG 2.2 AA)

- Texte courant ≥ 4,5:1 sur tous les fonds, en clair et en sombre ; éléments graphiques ≥ 3:1.
- Statuts toujours accompagnés d'un libellé texte, jamais signalés par la seule couleur.
- Focus visible (anneau ardoise), lien d'évitement « Aller au contenu », titres hiérarchisés, onglets et filtres au clavier.
- Vérifié automatiquement par axe-core sur toutes les pages, en thème clair et sombre ; aucun défilement horizontal à 375 px.
