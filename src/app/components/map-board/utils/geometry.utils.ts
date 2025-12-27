export type Point = { x: number; y: number };

export const GeometryUtils = {

  // Convertit un index linéaire (0, 1, 2...) en coordonnées X/Y (0,0 ...)
  indexToPoint(index: number, width: number): Point {
    return {
      x: index % width,
      y: Math.floor(index / width)
    };
  },

  // Convertit X/Y en index linéaire
  pointToIndex(p: Point, width: number): number {
    return p.y * width + p.x;
  },

  // --- FONCTION PRINCIPALE ---
  // Cette fonction parcourt toute la carte pour dire case par case : "Visible" ou "Caché".
  calculateVisibilitySet(
    source: Point,       // Où je suis
    width: number,       // Largeur de la carte
    height: number,      // Hauteur de la carte
    obstacles: Set<string> // Liste des murs (sous forme de texte "x,y")
  ): Set<string> {

    const visibleKeys = new Set<string>();

    // On ajoute toujours la source
    visibleKeys.add(`${source.x},${source.y}`);

    // On parcourt chaque ligne (y) et chaque colonne (x) de la carte
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const target = { x, y };
        // Je peux toujours me voir moi-même
        if (x === source.x && y === source.y) continue;

        // C'est ici qu'on lance le calcul mathématique :
        // "Trace une ligne d'ici à la cible et dis-moi si on touche un mur."
        if (this.checkLineOfSight(source, target, obstacles)) {
          visibleKeys.add(`${x},${y}`);
        }
      }
    }
    return visibleKeys;
  },

  // --- VÉRIFICATION DE LA VUE ---
  // Vérifie si la ligne de vue est dégagée entre p1 (moi) et p2 (la cible)
  checkLineOfSight(p1: Point, p2: Point, obstacles: Set<string>): boolean {
    // Si je vise mes propres pieds, c'est visible
    if (p1.x === p2.x && p1.y === p2.y) return true;

    // ÉTAPE CLÉ : Récupérer la liste de toutes les cases survolées par le rayon
    const line = this.getDofusRaycastLine(p1, p2);

    // On analyse chaque case sur le chemin du rayon
    for (const p of line) {
      // Si le point analysé est ma cible finale
      if (p.x === p2.x && p.y === p2.y) {
        return true; // J'ai réussi à l'atteindre ! (Même si c'est un mur, je vois le mur)
      }

      // Si je croise un obstacle ALORS QUE je n'ai pas encore atteint la cible...
      if (obstacles.has(`${p.x},${p.y}`)) {
        return false; // ...ma vue est bloquée.
      }
    }

    return true;
  },

  // --- LE COEUR MATHÉMATIQUE (RAYCASTING) ---
  // Implémente l'algorithme DDA (Digital Differential Analyzer)
  // Calcule la liste des cases traversées par une ligne droite entre p0 et p1
  getDofusRaycastLine(p0: Point, p1: Point): Point[] {
    const points: Point[] = [];

    // Différence de position (Delta) : "De combien je dois bouger en X et en Y ?"
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    // Théorème de Pythagore pour avoir la distance réelle en ligne droite
    // Racine carrée de (x² + y²)
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Si la distance est nulle, on ne bouge pas
    if (distance === 0) return [];

    // Normalisation : On réduit notre grand saut en "petits pas" de taille 1
    // stepX/Y nous dit : "Pour chaque mètre avancé sur la ligne, combien ça fait en X et en Y ?"
    const stepX = dx / distance;
    const stepY = dy / distance;

    // stepAbs (Absolu) : C'est l'inverse. "Combien de distance je dois parcourir sur la ligne
    // pour franchir 1 case entière en largeur ou en hauteur ?"
    // Infinity évite de diviser par 0 si on va tout droit horizontalement ou verticalement.
    const stepXAbs = stepX === 0 ? Infinity : Math.abs(1 / stepX);
    const stepYAbs = stepY === 0 ? Infinity : Math.abs(1 / stepY);

    // Dans quelle direction on va ? (1 = droite/bas, -1 = gauche/haut)
    const stepXSign = stepX < 0 ? -1 : 1;
    const stepYSign = stepY < 0 ? -1 : 1;

    // Initialisation des tMax :
    // On imagine qu'on part du CENTRE de la case (d'où le 0.5).
    // tMaxX = distance à parcourir avant de toucher le prochain bord vertical de la grille.
    let tMaxX = 0.5 * stepXAbs;
    let tMaxY = 0.5 * stepYAbs;

    let currentX = p0.x;
    let currentY = p0.y;

    // Sécurité pour ne pas faire planter l'ordi si la boucle tourne à l'infini
    let safety = 0;
    const maxSteps = Math.ceil(distance * 1.5) + 5;

    // TANT QU'on n'est pas arrivé à la case cible...
    while ((currentX !== p1.x || currentY !== p1.y) && safety < maxSteps) {
      safety++;

      // --- LA MAGIE DU COIN PARFAIT ---
      // Math.abs(...) < 0.0001 vérifie si tMaxX et tMaxY sont PRESQUE égaux.
      // Cela veut dire qu'on tape exactement le coin d'une case (la croix parfaite).
      // Dans ce cas, on avance en diagonale (on saute X et Y en même temps).
      if (Math.abs(tMaxX - tMaxY) < 0.0001) {
        tMaxX += stepXAbs;
        tMaxY += stepYAbs;
        currentX += stepXSign;
        currentY += stepYSign;
      }
      // Sinon, on avance là où le bord est le plus proche
      // Si le prochain bord vertical est plus proche que le bord horizontal...
      else if (tMaxX < tMaxY) {
        tMaxX += stepXAbs; // On avance le compteur de distance X
        currentX += stepXSign; // On change de case en X
      } else {
        tMaxY += stepYAbs; // On avance le compteur de distance Y
        currentY += stepYSign; // On change de case en Y
      }

      // On ajoute la case trouvée à la liste des cases traversées
      points.push({ x: currentX, y: currentY });
    }

    return points;
  },

  // Fonction utilitaire pour tourner un point (ex: tourner un sort de zone de 90°)
  rotatePoint(origin: Point, target: Point, quarterTurns: number): Point {
    // Le modulo % 4 assure qu'on reste entre 0 et 3 tours (0°, 90°, 180°, 270°)
    const turns = (quarterTurns % 4 + 4) % 4;

    if (turns === 0) return target; // Pas de rotation

    const dx = target.x - origin.x;
    const dy = target.y - origin.y;

    // Formules de rotation vectorielle simple pour une grille
    if (turns === 1) return { x: origin.x - dy, y: origin.y + dx }; // 90°
    if (turns === 2) return { x: origin.x - dx, y: origin.y - dy }; // 180°
    if (turns === 3) return { x: origin.x + dy, y: origin.y - dx }; // 270° (-90°)
    return target;
  }
};
