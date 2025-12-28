import { afterNextRender, Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapEntityType, Puzzle, PuzzleResult } from './model/puzzle.model';
import { MAP_HORIZONTAL_CELLS_COUNT, MAP_VERTICAL_CELLS_COUNT } from './utils/map.utils';
import { findShortestPath, findWinningCells, resolveLineOfSight } from './utils/puzzle.utils';
import { Point, pointRotateX, pointRotateZ } from './utils/geometry.utils';
import { Cell } from './model/map.model';

@Component({
  selector: 'trapotopia-map-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-board.component.html',
  styleUrl: './map-board.component.css'
})
export class DofusMapBoardComponent {
  // --- Inputs (Props) ---
  puzzle = input.required<Puzzle>();
  showLineOfSight = input(false);
  showWinningCells = input(false);
  showMovement = input(false);
  highlightCell = input<number | null>(null);

  // --- Outputs (Emits) ---
  cellClick = output<number>();
  puzzleCompleted = output<PuzzleResult>();

  // --- State (Refs) ---
  hoveredCellId = signal<number | null>(null);
  hoveredCellLineOfSight = signal<Set<number> | null>(null);
  movementPath = signal<Set<number> | null>(null);

  // --- ViewChild (Template Ref) ---
  gridRef = viewChild<ElementRef<HTMLDivElement>>('gridRef');
  // --- Constants ---
  readonly movementPoints = 5;
  readonly rows = MAP_HORIZONTAL_CELLS_COUNT + MAP_VERTICAL_CELLS_COUNT;
  readonly cols = MAP_HORIZONTAL_CELLS_COUNT + MAP_VERTICAL_CELLS_COUNT - 1;
  winningCells = computed(() => findWinningCells(this.movementPoints, this.puzzle()));
  // Signal pour stocker les dimensions calculées après le rendu
  private gridDimensions = signal<{ width: number, height: number, top: number, left: number } | null>(null);

  // --- Computed Logic ---
  wrapperStyle = computed(() => {
    const dims = this.gridDimensions();
    if (!dims) return { width: '0px', height: '0px' };
    return {
      width: `${dims.width}px`,
      height: `${dims.height}px`,
    };
  });
  gridCssStyle = computed(() => {
    const xRotation = 1.0472; // 60deg
    const zRotation = 0.785398; // 45deg
    const dims = this.gridDimensions();

    const baseStyle = {
      'grid-template-rows': `repeat(${this.rows}, var(--cell-size))`,
      'grid-template-columns': `repeat(${this.cols}, var(--cell-size))`,
      transform: `rotateX(${xRotation}rad) rotateZ(-${zRotation}rad)`,
    };

    if (!dims) return baseStyle;

    return {
      ...baseStyle,
      top: `${dims.top}px`,
      left: `${dims.left}px`,
    };
  });

  constructor() {
    afterNextRender(() => {
      this.calculateGridDimensions();
    });
  }

  // --- Methods ---

  resolveCellPosition(cellId: number) {
    const row = Math.round(cellId / (2 * MAP_HORIZONTAL_CELLS_COUNT)) + cellId % MAP_HORIZONTAL_CELLS_COUNT + 1;
    const col = -Math.trunc(cellId / (2 * MAP_HORIZONTAL_CELLS_COUNT)) + cellId % MAP_HORIZONTAL_CELLS_COUNT + MAP_VERTICAL_CELLS_COUNT;
    return [row, col] as const;
  }

  resolveCellPositionStyle(cellId: number) {
    const [row, col] = this.resolveCellPosition(cellId);
    return { 'grid-area': `${row} / ${col}` };
  }

  getCellClasses(cellId: number): string[] {
    const classes: string[] = [];
    const puzzle = this.puzzle();
    const cell = puzzle.map.cells[cellId];

    if (cell === Cell.Floor) {
      classes.push('cell-floor');
      const [row, col] = this.resolveCellPosition(cellId);
      classes.push(((row + col) % 2) === 0 ? 'cell-even' : 'cell-odd');

      const los = this.hoveredCellLineOfSight();
      if (this.showLineOfSight() && los !== null && !los.has(cellId)) {
        classes.push('cell-fog');
      }
    } else if (cell === Cell.Hole) {
      classes.push('cell-hole');
    } else if (cell === Cell.Wall) {
      classes.push('cell-wall');
    }

    return classes;
  }

  isWall(cellId: number): boolean {
    return this.puzzle().map.cells[cellId] === Cell.Wall;
  }

  // --- Template Helpers (C'est ce qui manquait !) ---

  isPathCell(cellId: number): boolean {
    return this.showMovement() && (this.movementPath()?.has(cellId) ?? false);
  }

  getEntityClass(cellId: number): string | null {
    const entity = this.puzzle().entities.find(e => e.cellId === cellId);
    if (!entity) return null;

    // Retourne directement la classe CSS attendue
    return entity.type === MapEntityType.Ally ? 'cell-ally' : 'cell-enemy';
  }

  isWinningCell(cellId: number): boolean {
    return this.showWinningCells() && this.winningCells().includes(cellId);
  }

  isLosingCell(cellId: number): boolean {
    // Si on affiche les résultats, que ce n'est PAS une case gagnante
    // mais que c'est celle qui a été cliquée (highlightCell)
    return this.showWinningCells() &&
      !this.winningCells().includes(cellId) &&
      this.highlightCell() === cellId;
  }

  onCellOverEnter(evt: MouseEvent) {
    const cellId = this.getCellIdFromMouseEvent(evt);
    const puzzle = this.puzzle();

    if (puzzle.map.cells[cellId] === Cell.Floor) {
      this.hoveredCellId.set(cellId);
      this.hoveredCellLineOfSight.set(new Set(resolveLineOfSight(cellId, puzzle, true)));
    }

    const ally = puzzle.entities.find(e => e.type === MapEntityType.Ally);
    if (!ally) return;

    const path = findShortestPath(ally.cellId, cellId, puzzle);
    this.movementPath.set((path === null || path.length > this.movementPoints) ? null : new Set(path));
  }

  // --- Event Handlers ---

  onCellOverLeave(_: MouseEvent) {
    this.hoveredCellId.set(null);
    this.hoveredCellLineOfSight.set(null);
    this.movementPath.set(null);
  }

  onCellClick(evt: MouseEvent) {
    const targetCellId = this.getCellIdFromMouseEvent(evt);
    const puzzle = this.puzzle();

    if (puzzle.map.cells[targetCellId] !== Cell.Floor) {
      return;
    }

    this.cellClick.emit(targetCellId);

    const ally = puzzle.entities.find(e => e.type === MapEntityType.Ally);
    if (!ally) return;

    const path = findShortestPath(ally.cellId, targetCellId, puzzle);
    if (path === null || path.length > this.movementPoints) {
      return;
    }

    this.puzzleCompleted.emit({
      success: this.winningCells().includes(targetCellId),
      cellId: targetCellId,
    });
  }

  private calculateGridDimensions() {
    const el = this.gridRef()?.nativeElement;
    if (!el || el.children.length === 0) return;

    const xRotation = 1.0472;
    const zRotation = 0.785398;

    const originalWidth = el.scrollWidth;
    const originalHeight = el.scrollHeight;

    const topRightPoint: Point = [originalWidth / 2.0, originalHeight / 2.0];
    const topLeftPoint: Point = [-originalWidth / 2.0, originalHeight / 2.0];

    const rotatedTopRightPoint = pointRotateX(pointRotateZ(topRightPoint, zRotation), xRotation);
    const rotatedTopLeftPoint = pointRotateX(pointRotateZ(topLeftPoint, zRotation), xRotation);

    let top = rotatedTopRightPoint[1] - topRightPoint[1];
    let left = topLeftPoint[0] - rotatedTopLeftPoint[0];

    const cellRect = el.children[0].getBoundingClientRect();
    top -= cellRect.height * (MAP_HORIZONTAL_CELLS_COUNT - 1) / 2.0;
    left -= cellRect.width * (MAP_VERTICAL_CELLS_COUNT - 1) / 2.0;

    const width = cellRect.width * (MAP_HORIZONTAL_CELLS_COUNT + 0.5);
    const height = cellRect.height * (MAP_VERTICAL_CELLS_COUNT + 0.5);

    this.gridDimensions.set({ width, height, top, left });
  }

  private getCellIdFromMouseEvent(evt: MouseEvent): number {
    const target = evt.currentTarget as HTMLElement;
    return parseInt(target.dataset['cellid']!, 10);
  }
}
