# Charte graphique TongaPass

![Logo TongaPass](logo.svg)

## 1. Le nom

**TongaPass** associe le malgache *tonga* (« arriver » ; *tonga soa* = « bienvenue ») et l'anglais *pass* (badge, laissez-passer). Le nom dit ce que fait le produit : il remet à chaque arrivant ses accès, les ajuste quand il change de poste et les reprend le jour de son départ.

**Promesse :** *Les accès de vos équipes, de l'arrivée au départ.*

## 2. Le concept : « Lagon de verre »

TongaPass est un outil de travail quotidien pour les RH, les administrateurs IAM et les auditeurs. L'interface doit inspirer **confiance et maîtrise**, tout en restant moderne et agréable à utiliser toute la journée :

- **Des surfaces en verre dépoli** posées sur un **fond d'aurore** : cartes, barre latérale et barre supérieure sont translucides (72 % d'opacité en clair, 58 % en sombre) avec un flou d'arrière-plan. La profondeur vient de la transparence, pas de décorations.
- **Une aurore vivante mais discrète** : quatre halos (lagon, indigo, ciel, rose pâle) dérivent très lentement (40 à 60 s par cycle) derrière les surfaces, avec une trame fine de bureau d'études en haut de page. Ambiance « poste de travail », jamais « affiche publicitaire ».
- **La couleur porte une information.** Lagon = accès accordé ou conforme ; indigo = en cours ; corail = révocation ou échec ; ambre = planifié ou à surveiller. Le dégradé de marque (lagon vers indigo) est réservé à l'action principale et à l'élément actif.
- **Le temps réel se voit.** Ce qui est en direct bouge (pouls, onde, rayures qui défilent) ; ce qui est figé ne bouge pas.
- **Les données d'abord** : tableaux lisibles, chiffres tabulaires, identifiants en chasse fixe.

## 3. Couleurs

Toutes les valeurs ci-dessous sont vérifiées pour un contraste WCAG AA (≥ 4,5:1) sur le verre, **y compris dans le pire cas** où la carte passe au-dessus du centre d'un halo d'aurore.

| Nom | Clair | Sombre | Usage |
|---|---|---|---|
| Lagon (marque) | `#0A6E67` | `#2DD4BF` | Logo, liens de marque, accès accordé, étape réussie |
| Indigo | `#4338CA` | `#A5B4FC` | En cours, liens, anneau de focus |
| Corail | `#B0103A` | `#FB7185` | Révocation, danger, échec, écart de droits |
| Ambre | `#8A4A08` | `#FBBF24` | Planifié, droit sensible, exécution partielle |
| Encre | `#0B1324` | `#EDF1F8` | Texte principal |
| Ardoise | `#475569` | `#A3AFC4` | Texte secondaire |
| Toile | `#EEF2F7` | `#060912` | Fond sous l'aurore |
| Verre | blanc à 72 % | `#111827` à 58 % | Cartes, barres, tableaux (avec flou de 18 px) |
| Liseré | encre à 9 % | blanc à 8,5 % | Bordures de 1 px |

**Dégradé de marque** (bouton principal, onglet et entrée de menu actifs, étapes réussies) : `#0A6E67 → #0D6680 → #4338CA` en clair, `#2DD4BF → #38BDF8 → #818CF8` en sombre. Le texte posé dessus garde un contraste supérieur à 4,5:1 sur toute la longueur du dégradé (blanc en clair, encre `#04201D` en sombre).

Le lagon évoque les eaux de la côte malgache, et le verre la **transparence** attendue d'un outil qui gère des droits : on voit à travers, rien n'est caché.

**Séries de graphique** (arrivées / départs) : lagon `#0D9488` et indigo `#6366F1` en clair, `#2DD4BF` et `#818CF8` en sombre, en dégradé vertical. Les deux séries diffèrent nettement en luminance (lisibles par les personnes daltoniennes) ; le graphique propose toujours une **vue tableau** et des infobulles.

**Couleurs des profils d'accès** (identification, toujours accompagnées du nom du profil) : indigo `#3B57C2`, ocre `#A25A12`, sarcelle `#00876D`, améthyste `#7A4AA8`, latérite `#B3412B`, lagon `#1C7FB0`, litchi `#A63A72`, et ardoise `#64708A` pour les profils neutres.

## 4. Typographie

| Rôle | Police | Pourquoi |
|---|---|---|
| Interface et titres | **Plus Jakarta Sans** (variable, 200 à 800) | Géométrique et chaleureuse, très lisible en petite taille, excellente couverture du français ; ses graisses fortes donnent des titres modernes |
| Identifiants, matricules, rôles, empreintes | **IBM Plex Mono** | Chasse fixe : un identifiant ou un rôle se lit caractère par caractère |

Tailles : corps 14 px, texte secondaire 13 px, titres de page 26 px extra-gras, titres de section 14,5 px semi-gras, surtitres 12 px en capitales espacées. Chiffres tabulaires dans les tableaux et indicateurs.

Les polices sont auto-hébergées (Fontsource, et embarquées dans le thème Keycloak) : aucune requête vers un CDN tiers, ce qui sert la confidentialité et la CSP stricte. Licence SIL OFL 1.1.

## 5. Logo « le Seuil »

- **Une porte en arche entrouverte** : le battant gauche est plein, le battant droit est **en verre** (translucide) et s'écarte en haut : le passage s'ouvre. Une lumière douce traverse l'embrasure.
- **Au centre, une silhouette qui est aussi un trou de serrure** : la personne et son accès dans un même signe. C'est tout le métier de TongaPass : faire entrer, puis reprendre la clé.
- **Tuile** aux coins très arrondis, en dégradé lagon `#19C2AD` → `#0E8A98` → indigo `#5653D4`, avec un reflet de verre en haut.
- **Mot-symbole** : « Tonga » à l'encre, « Pass » dans le dégradé de marque, Plus Jakarta Sans gras, approche resserrée (−2,5 %).
- Zone de protection : un quart de la largeur de la tuile tout autour. Taille minimale : 16 px (favicon), 120 px pour le logo avec mot-symbole.
- Sur l'écran de chargement, le battant de verre « respire » (opacité qui pulse) ; il est figé si les animations sont réduites.
- Fichiers : [`logo.svg`](logo.svg), [`banner.svg`](banner.svg), favicon `apps/portal/public/favicon.svg`, thème de connexion `infra/keycloak/themes/tongapass/login/resources/img/logo.svg`, composant `apps/portal/src/components/brand/Logo.tsx`.

## 6. Pictogrammes

TongaPass n'utilise **aucune banque d'icônes** ni aucun émoji : les 55 pictogrammes du portail ont été dessinés pour le produit ([`components/icons`](../../apps/portal/src/components/icons/index.tsx)).

- Grille de 24 px, trait arrondi de 1,75 px, coins doux.
- **Un aplat « verre »** : chaque pictogramme remplit une de ses formes à 16 % de la couleur du texte, comme les surfaces de l'interface.
- Chaque forme dit le métier : le journal d'audit est une **pile de blocs chaînés**, l'intégrité deux **maillons**, les profils un **badge nominatif**, les intégrations un **moyeu** relié à trois services, une arrivée une silhouette avec un **badge « + »**, n8n une **puce d'automate**.
- Les pictogrammes accompagnent toujours un libellé texte ; ils sont masqués aux lecteurs d'écran (`aria-hidden`).

## 7. Navigation

- **Barre latérale flottante en verre**, détachée des bords (marge de 12 px, coins de 22 px). Une **pilule en dégradé glisse** vers la page active (animation à ressort). Repliable en mode icônes (préférence mémorisée), libellés conservés en infobulle et pour les lecteurs d'écran.
- **Barre supérieure flottante** : recherche (Ctrl/⌘ + K), horloge, **pouls temps réel**, **fil d'activité en direct**, bascule de thème animée, menu du compte et liens vers les outils de la pile.
- **Accueil** : barre de navigation en pilule qui se renforce (verre opaque) dès que la page défile, ancres vers les sections.

## 8. Animations et temps réel

Les animations expliquent un changement d'état ou signalent le direct. Courbe `cubic-bezier(0.2, 0.8, 0.2, 1)`, 130 à 320 ms pour l'interface, entrées de page ≤ 0,6 s.

| Animation | Sens |
|---|---|
| **Pouls** de la barre supérieure : une ligne qui défile et bat à chaque événement | Le flux SSE est vivant ; chaque battement = un signal de n8n reçu |
| **Fil d'activité en direct** : les événements arrivent en haut, avec un éclat lagon | Ce qui vient de se passer, sans recharger |
| **Onde** autour d'un point « en direct » | Exécution, révocation ou provisionnement en cours |
| **Rayures qui défilent** dans une barre de progression | Le workflow travaille |
| Étape qui se valide, liaison qui se remplit en dégradé | n8n vient de confirmer l'étape |
| Pilule et onglet actifs qui glissent | Où l'on se trouve |
| Compteurs qui montent, jauge de conformité qui se remplit | Arrivée des données |
| Halo qui suit le pointeur sur les cartes | La carte est cliquable |
| Aurore qui dérive (40 à 60 s) | Ambiance ; aucune information |
| Schéma d'architecture : paquets qui circulent entre portail, API, n8n et outils | Comment circule une demande |

`prefers-reduced-motion` est respecté partout : l'aurore se fige, les ondes disparaissent et chaque état s'affiche directement dans sa forme finale.

## 9. Ton et rédaction

- Français, phrases courtes, voix active, vocabulaire RH sans jargon technique.
- Les boutons disent ce qu'ils font : « Révoquer les accès », « Appliquer la mobilité », « Planifier l'arrivée », pas « Valider ».
- Les erreurs expliquent quoi faire : « Recopiez l'identifiant hanitra.rakoto pour confirmer ».
- Les états vides disent ce qui se passera : « Chaque étape exécutée par n8n apparaîtra ici dès sa réception ».
- Pas d'émoji, pas de point d'exclamation dans l'interface.

## 10. Accessibilité (niveau visé : WCAG 2.2 AA)

- Contrastes calculés sur le verre dans le pire cas (au-dessus d'un halo) ; sans prise en charge du flou d'arrière-plan, les surfaces deviennent opaques.
- Statuts toujours accompagnés d'un libellé texte, jamais signalés par la seule couleur.
- Focus visible (anneau indigo), lien d'évitement « Aller au contenu », titres hiérarchisés, onglets et filtres au clavier.
- Vérifié automatiquement par axe-core sur toutes les pages, en thème clair et sombre ; aucun défilement horizontal à 375 px.
- Cibles cliquables ≥ 32 px, libellés reliés aux champs, erreurs annoncées aux lecteurs d'écran.
