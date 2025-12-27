import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeometryUtils, Point } from '../utils/geometry.utils';

interface DebugCell {
  x: number;
  y: number;
  status: 'source' | 'obstacle' | 'visible' | 'hidden';
}

@Component({
  selector: 'trapotopia-dofus-los-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center gap-6 bg-slate-100 min-h-screen p-8 text-slate-800 font-sans">

      <header class="text-center space-y-2">
        <h2 class="text-3xl font-bold text-slate-900">Debug Ligne de Vue</h2>
        <div class="flex gap-4 justify-center text-sm font-medium">
          <span class="flex items-center gap-2"><span class="w-3 h-3 bg-blue-500 rounded-full"></span> Source</span>
          <span class="flex items-center gap-2"><span class="w-3 h-3 bg-slate-800 rounded-sm"></span> Obstacle</span>
          <span class="flex items-center gap-2"><span class="w-3 h-3 bg-red-200 rounded-sm border border-red-300"></span> Zone cachée</span>
          <span class="flex items-center gap-2"><span class="w-3 h-3 bg-white border border-slate-300 rounded-sm"></span> Visible</span>
        </div>
      </header>

      <div
        class="grid gap-px bg-slate-300 border-4 border-slate-300 shadow-2xl rounded-lg overflow-hidden select-none"
        [style.grid-template-columns]="'repeat(' + size + ', 2.5rem)'"
        (mouseleave)="mousePos.set(null)"
      >
        @for (cell of gridData(); track $index) {
          <div
            class="w-10 h-10 flex items-center justify-center text-xs cursor-crosshair relative"
            [ngClass]="getCellClass(cell.status)"
            (mouseenter)="mousePos.set({x: cell.x, y: cell.y})"
            (mousedown)="toggleObstacle(cell.x, cell.y)"
          >
            <span class="opacity-0 hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/20 text-white font-mono pointer-events-none z-20">
              {{cell.x}},{{cell.y}}
            </span>
          </div>
        }
      </div>

      <div class="bg-white p-4 rounded shadow text-sm text-slate-600 max-w-md text-center">
        <p>Survolez les cases pour déplacer la source.</p>
        <p>Cliquez pour ajouter/retirer des obstacles.</p>
      </div>
    </div>
  `
})
export class DofusLosDebugComponent {
  readonly size = 15; // Taille de la grille (carrée ici pour simplifier)

  // --- State ---
  mousePos = signal<Point | null>({ x: 7, y: 7 });
  obstacles = signal<Set<string>>(new Set(['7,5', '6,5', '8,5', '7,4']));

  // --- Computed Logic ---
  gridData = computed<DebugCell[]>(() => {
    const w = this.size;
    const h = this.size;
    const source = this.mousePos();
    const obs = this.obstacles();

    // 1. Calculer les cases visibles (Set<"x,y">)
    // Si pas de souris, on considère qu'on est hors map, donc 0 visibilité
    let visibleSet = new Set<string>();

    if (source) {
      visibleSet = GeometryUtils.calculateVisibilitySet(source, w, h, obs);
    }

    // 2. Construire la grille pour l'affichage (Grid CSS plate)
    const grid: DebugCell[] = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const key = `${x},${y}`;
        let status: DebugCell['status'] = 'visible'; // Par défaut : sol visible

        // Hiérarchie des statuts :
        if (source && x === source.x && y === source.y) {
          status = 'source';
        } else if (obs.has(key)) {
          status = 'obstacle';
        } else if (source && !visibleSet.has(key)) {
          // Si on a une source MAIS que ce n'est pas dans le set visible
          status = 'hidden';
        } else if (!source) {
          // Cas esthétique : si pas de souris, on affiche tout en "visible" (ou hidden selon préférence)
          status = 'visible';
        }

        grid.push({ x, y, status });
      }
    }

    return grid;
  });

  // --- UI Helpers ---
  getCellClass(status: DebugCell['status']): string {
    switch (status) {
      case 'source':
        return 'bg-blue-500 z-10 scale-110 shadow-lg ring-2 ring-white rounded-sm';
      case 'obstacle':
        return 'bg-slate-800 z-0';
      case 'hidden':
        return 'bg-red-200 text-red-900/10'; // Zone d'ombre
      case 'visible':
        return 'bg-white hover:bg-blue-50';
      default:
        return 'bg-white';
    }
  }

  // --- Actions ---
  toggleObstacle(x: number, y: number) {
    const key = `${x},${y}`;

    this.obstacles.update(set => {
      const newSet = new Set(set); // Copie pour immuabilité
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  }
}
