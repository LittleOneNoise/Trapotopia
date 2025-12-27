import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellType, EntityType, MapData, MapEntity, RenderedCell } from './model/map-board.model';
import { GeometryUtils } from './utils/geometry.utils';

@Component({
  selector: 'trapotopia-map-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-wrapper" [style.width.px]="gridDimensions().width" [style.height.px]="gridDimensions().height">

      <div class="grid-container" [style]="gridTransformStyle()">

        @for (cell of renderedCells(); track cell.id) {
          <div
            class="cell"
            [class]="getCellClasses(cell)"
            [style.grid-area]="cell.cssRow + ' / ' + cell.cssCol"
            (mouseenter)="onCellHover(cell)"
            (mouseleave)="onCellLeave()"
            (click)="onCellClick(cell)"
          >
            @if (cell.type === CellType.Wall) {
              <div class="wall-face wall-left"></div>
              <div class="wall-face wall-top"></div>
              <div class="wall-face wall-right"></div>
            }

            @if (getEntityAt(cell.id); as entity) {
              <div [class]="getEntityClasses(entity)"></div>
            }

            <div class="cell-overlay"></div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    /* Container principal qui coupe ce qui dépasse */
    .grid-wrapper {
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0f172a; /* Dark bg */
    }

    /* La grille transformée en 3D */
    .grid-container {
      display: grid;
      gap: 0;
      /* Centrage absolu pour éviter que la rotation ne sorte de l'écran */
      position: absolute;
      transform-style: preserve-3d;
    }

    .cell {
      position: relative;
      width: 100%;
      height: 100%;
      transition: filter 0.1s ease;
    }

    /* --- SOLS --- */
    .cell-floor {
      cursor: pointer;
    }
    .cell-floor.cell-even { background-color: #8b8561; }
    .cell-floor.cell-odd { background-color: #958d69; }

    /* Line of Sight : On assombrit les cases non visibles */
    .cell-hidden {
      filter: brightness(0.4) grayscale(0.5);
    }

    .cell-hovered {
      filter: brightness(1.3) !important; /* Priorité sur le hidden */
      box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5);
    }

    /* --- MURS (3D FAKE) --- */
    .cell-wall {
      /* Le dessus du mur est un peu plus clair */
      background-color: #6d664b;
      z-index: 10; /* Le mur doit passer au dessus des sols "derrière" lui visuellement */
    }

    /* Faces latérales des murs pour l'effet de hauteur */
    .wall-face {
      position: absolute;
      background-color: #58533a;
      outline: 1px solid rgba(0,0,0,0.1); /* Légère bordure */
      pointer-events: none;
    }

    /* Face supérieure (Top) */
    .wall-top {
      width: 100%;
      height: 100%;
      transform: translateZ(20px); /* Monter visuellement si on utilisait de la vraie 3D, ici décoratif */
      opacity: 0; /* En vue iso pure, la face "top" est la case elle-même */
    }

    /* Face Gauche (Skew Y) */
    .wall-left {
      width: 50%;
      height: 100%;
      right: 0;
      top: 50%;
      background-color: #4a4530; /* Face ombrée */
      transform-origin: top right;
      transform: skewY(-45deg) scaleY(1.414); /* Magie mathématique pour lier les tuiles */
      z-index: -1;
    }

    /* Face Droite (Skew X) */
    .wall-right {
      width: 100%;
      height: 50%;
      left: 50%;
      bottom: 0;
      background-color: #3b3726; /* Face très ombrée */
      transform-origin: bottom left;
      transform: skewX(-45deg) scaleX(1.414);
      z-index: -1;
    }

    /* --- ENTITÉS --- */
    .entity {
      position: absolute;
      top: 10%;
      left: 10%;
      width: 80%;
      height: 80%;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      transform: rotateZ(45deg); /* Contre-rotation pour que l'entité paraisse droite face caméra */
    }

    .entity-ally { background-color: #3b82f6; border: 2px solid #93c5fd; }
    .entity-enemy { background-color: #ef4444; border: 2px solid #fca5a5; }
    .entity-obstacle { background-color: #475569; border-radius: 10%; } /* Caisse carrée */
  `]
})
export class DofusMapBoardComponent {
  // --- Inputs ---
  mapData = input.required<MapData>();
  entities = input<MapEntity[]>([]);

  // Configuration
  showLineOfSight = input(true); // Activer/Désactiver le brouillard
  viewPoint = input<number | null>(null); // L'ID de la cellule qui "regarde" (ex: le joueur actif)

  // --- Outputs ---
  cellClicked = output<number>();

  // --- State interne ---
  hoveredCellId = signal<number | null>(null);

  // --- Constantes graphiques ---
  readonly CELL_SIZE = 48; // px (équivalent 3rem)

  // --- Computeds (Optimisation) ---

  // 1. Pré-calcul des coordonnées CSS et Logiques pour chaque cellule
  // Cela évite de refaire des maths dans le template à chaque frame
  renderedCells = computed<RenderedCell[]>(() => {
    const map = this.mapData();
    return map.cells.map((type, id) => {
      // Conversion ID -> Logique (X,Y)
      const logicPos = GeometryUtils.indexToPoint(id, map.width);

      // Conversion ID -> Visuel (Grid CSS Row/Col)
      // Note: J'adapte la logique "Zigzag" du fichier VueJS fourni pour matcher l'image
      const row = Math.round(id / (2 * map.width)) + (id % map.width) + 1;
      const col = -Math.trunc(id / (2 * map.width)) + (id % map.width) + map.height;

      return { id, type, x: logicPos.x, y: logicPos.y, cssRow: row, cssCol: col };
    });
  });

  // 2. Calcul des obstacles (Murs + Obstacles dynamiques)
  obstaclesSet = computed<Set<string>>(() => {
    const obstacles = new Set<string>();
    const map = this.mapData();
    const entities = this.entities();

    // Ajouter les murs statiques
    map.cells.forEach((cell, idx) => {
      if (cell === CellType.Wall || cell === CellType.Invisible) {
        const p = GeometryUtils.indexToPoint(idx, map.width);
        obstacles.add(`${p.x},${p.y}`);
      }
    });

    // Ajouter les entités obstacles
    entities.forEach(ent => {
      if (ent.type === EntityType.Obstacle) {
        const p = GeometryUtils.indexToPoint(ent.cellId, map.width);
        obstacles.add(`${p.x},${p.y}`);
      }
    });

    return obstacles;
  });

  // 3. Calcul de la Ligne de Vue (LoS)
  // Se recalcule UNIQUEMENT si la souris bouge, ou si le point de vue change, ou si les obstacles changent.
  visibleCellsSet = computed<Set<string> | null>(() => {
    if (!this.showLineOfSight()) return null;

    // Priorité : Si on survole une case sol, c'est la source.
    // Sinon, on utilise le viewPoint (personnage actif).
    const hoverId = this.hoveredCellId();
    const fixedViewId = this.viewPoint();

    let sourceId: number | null = null;

    // Si on survole le sol, on calcule depuis la souris (mode tactique/preview de déplacement)
    if (hoverId !== null && this.mapData().cells[hoverId] === CellType.Floor) {
      sourceId = hoverId;
    } else if (fixedViewId !== null) {
      sourceId = fixedViewId;
    }

    if (sourceId === null) return null;

    const sourcePoint = GeometryUtils.indexToPoint(sourceId, this.mapData().width);

    return GeometryUtils.calculateVisibilitySet(
      sourcePoint,
      this.mapData().width,
      this.mapData().height,
      this.obstaclesSet()
    );
  });

  // --- Méthodes CSS Dynamiques ---

  gridDimensions = computed(() => {
    const h = this.mapData().height;
    const w = this.mapData().width;
    // Estimation approximative de la bounding box isométrique
    return {
      width: (w + h) * (this.CELL_SIZE * 0.8),
      height: (w + h) * (this.CELL_SIZE * 0.5)
    };
  });

  gridTransformStyle = computed(() => {
    // Rotation isométrique standard : rotateX(60deg) rotateZ(-45deg)
    // C'est ce qui "aplatit" la grille carrée pour en faire des losanges.
    return `
      transform: rotateX(60deg) rotateZ(-45deg);
      grid-template-rows: repeat(${this.mapData().height * 2}, ${this.CELL_SIZE}px);
      grid-template-columns: repeat(${this.mapData().width * 2}, ${this.CELL_SIZE}px);
    `;
  });

  // --- Helpers de Template ---

  getCellClasses(cell: RenderedCell): string {
    const classes = [];

    // Type de base
    if (cell.type === CellType.Floor) classes.push('cell-floor');
    if (cell.type === CellType.Hole) classes.push('cell-hole');
    if (cell.type === CellType.Wall) classes.push('cell-wall');

    // Pattern damier (Pair/Impair) pour esthétique Dofus
    if ((cell.x + cell.y) % 2 === 0) classes.push('cell-even');
    else classes.push('cell-odd');

    // Gestion de la visibilité (Fog of War)
    const visibility = this.visibleCellsSet();
    if (visibility) {
      const key = `${cell.x},${cell.y}`;
      // Si ce n'est PAS dans le set visible, on assombrit
      if (!visibility.has(key)) {
        classes.push('cell-hidden');
      }
    }

    // Highlight du curseur
    if (this.hoveredCellId() === cell.id) {
      classes.push('cell-hovered');
    }

    return classes.join(' ');
  }

  getEntityAt(cellId: number): MapEntity | undefined {
    return this.entities().find(e => e.cellId === cellId);
  }

  getEntityClasses(entity: MapEntity): string {
    const base = 'entity';
    if (entity.type === EntityType.Ally) return `${base} entity-ally`;
    if (entity.type === EntityType.Enemy) return `${base} entity-enemy`;
    return `${base} entity-obstacle`;
  }

  // --- Events ---

  onCellHover(cell: RenderedCell) {
    this.hoveredCellId.set(cell.id);
  }

  onCellLeave() {
    this.hoveredCellId.set(null);
  }

  onCellClick(cell: RenderedCell) {
    if (cell.type === CellType.Floor) {
      this.cellClicked.emit(cell.id);
    }
  }

  protected readonly CellType = CellType;
}
