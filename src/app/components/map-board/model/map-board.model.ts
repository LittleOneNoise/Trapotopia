export enum CellType {
  Invisible = 0,
  Floor = 1,
  Hole = 2,
  Wall = 3,
}

export enum EntityType {
  Ally = 0,
  Enemy = 1,
  Obstacle = 2,
}

export interface MapEntity {
  cellId: number;
  type: EntityType;
}

export interface MapData {
  id: number;
  width: number;  // Ajout important pour le calcul X/Y
  height: number; // Ajout important pour le calcul X/Y
  cells: CellType[];
}

// Pour simplifier la gestion des coordonnées dans le template
export interface RenderedCell {
  id: number;
  type: CellType;
  x: number;
  y: number;
  cssRow: number;
  cssCol: number;
}
