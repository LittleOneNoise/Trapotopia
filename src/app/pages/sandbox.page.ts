import { Component, signal } from '@angular/core';
import { DofusMapBoardComponent } from '../components/map-board/map-board.component';
import { Puzzle, PuzzleResult } from '../components/map-board/model/puzzle.model';
import { getPuzzles } from '../components/map-board/repository/puzzle.repository';
import { arrayShuffle } from '../components/map-board/utils/array.utils';

@Component({
  standalone: true,
  imports: [
    DofusMapBoardComponent
  ],
  template: `
    <trapotopia-map-board [puzzle]="puzzle()"
                          [showLineOfSight]="showLineOfSight()"
                          [showWinningCells]="showWinningCells()"
                          [showMovement]="showMovement()"
                          [highlightCell]="highlightCell()"
                          (puzzleCompleted)="onPuzzleCompleted($event)"/>

    @if (puzzleResult(); as result) {
      <div class="result-modal">
        <h3>{{ result.success ? 'Victoire !' : 'Échec' }}</h3>
        <button (click)="onNextPuzzle()">Niveau Suivant</button>
      </div>
    }
  `
  ,
  styles: [`
  `]
})
export default class SandboxPage {

  // --- Initialisation des données ---
  puzzleResult = signal<PuzzleResult | null>(null);
  playing = signal<boolean>(true);
  // pour les binder individuellement aux Inputs du composant enfant.
  showLineOfSight = signal(false);
  showWinningCells = signal(false);

  // --- Map Configuration State (remplace mapProps) ---
  // Il est plus performant et propre en Angular de séparer les signaux
  showMovement = signal(true);
  highlightCell = signal<number | null>(null);
  // On récupère les puzzles. Note : Idéalement, ceci devrait être dans un Service.
  private puzzles: Puzzle[] = getPuzzles();
  // --- State Signals (remplace les refs) ---
  puzzle = signal<Puzzle>(this.puzzles[0]);

  constructor() {
    // Initialisation : mélange et sélection du premier
    arrayShuffle(this.puzzles);
    this.puzzle.set(this.puzzles[0]);
  }

  // --- Méthodes ---

  onPuzzleCompleted(r: PuzzleResult) {
    if (!this.playing()) {
      return;
    }

    // Mise à jour de l'état
    this.playing.set(false);
    this.puzzleResult.set(r);

    // Mise à jour de la configuration de la carte (révélation)
    this.showLineOfSight.set(true);
    this.showWinningCells.set(true);
    this.showMovement.set(false);
    this.highlightCell.set(r.cellId);
  }

  onNextPuzzle() {
    if (this.playing()) {
      return;
    }

    // Reset de l'état du jeu
    this.playing.set(true);
    this.puzzleResult.set(null);

    // Reset de la configuration de la carte
    this.showLineOfSight.set(false);
    this.showWinningCells.set(false);
    this.showMovement.set(true);
    this.highlightCell.set(null);

    // Logique de sélection du prochain puzzle
    const currentId = this.puzzle().id; // Supposant que Puzzle a un id
    const puzzleIdx = this.puzzles.findIndex(p => p.id === currentId);

    if (puzzleIdx === this.puzzles.length - 1) {
      // Si c'était le dernier, on remélange et on repart du début
      arrayShuffle(this.puzzles);
      this.puzzle.set(this.puzzles[0]);
    } else {
      // Sinon on prend le suivant
      this.puzzle.set(this.puzzles[puzzleIdx + 1]);
    }
  }

}
