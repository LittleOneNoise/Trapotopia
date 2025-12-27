import { Component, signal, WritableSignal } from '@angular/core';
import { DofusMapBoardComponent } from '../components/map-board/map-board.component';
import { CellType, EntityType, MapData, MapEntity } from '../components/map-board/model/map-board.model';
import { DofusLosDebugComponent } from '../components/map-board/debug/dofus-los-debug.component';

@Component({
  standalone: true,
  imports: [
    DofusMapBoardComponent,
    DofusLosDebugComponent
  ],
  template: `
    <trapotopia-dofus-los-debug/>
    <div class="game-container">
      <div class="ui-panel">
        <h1>Arène de test</h1>
        <p>Joueur: Case {{ playerCellId() }}</p>
        <p>Cliquez sur le sol pour vous déplacer.</p>

        <label>
          <input type="checkbox" [checked]="showLos()" (change)="toggleLos()">
          Activer Ligne de Vue (Fog of War)
        </label>
      </div>

      <trapotopia-map-board
        [mapData]="currentMap"
        [entities]="entities()"
        [viewPoint]="playerCellId()"
        [showLineOfSight]="showLos()"
        (cellClicked)="onMapClick($event)"
      />
    </div>
  `
  ,
  styles: [`
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #1e293b; /* Dark Slate */
      min-height: 100vh;
      color: white;
      font-family: sans-serif;
    }

    .ui-panel {
      margin-bottom: 20px;
      z-index: 100; /* Au dessus de la map */
      text-align: center;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
    }

    label {
      cursor: pointer;
      display: block;
      margin-top: 10px;
      font-weight: bold;
      color: #93c5fd;
    }
  `]
})
export default class SandboxPage {
  // --- Données de la Carte (14x14 est un standard courant) ---
  readonly MAP_WIDTH = 14;
  readonly MAP_HEIGHT = 14;

  // On ne change pas la structure de la map dans cet exemple, donc pas besoin de Signal pour mapData entier
  currentMap: MapData = this.generateDemoMap();

  // --- État du Jeu (Signals) ---

  // Position du joueur (sert de ViewPoint pour la ligne de vue)
  playerCellId = signal<number>(198); // Commence en bas à droite (environ)

  // Liste des entités (Joueurs, Monstres, Obstacles)
  entities: WritableSignal<MapEntity[]> = signal([
    { cellId: 198, type: EntityType.Ally }, // Le Joueur (doit matcher playerCellId au début)
    { cellId: 28, type: EntityType.Enemy },  // Un ennemi en haut
    { cellId: 105, type: EntityType.Obstacle }, // Un tonneau au milieu
  ]);

  showLos = signal(true);

  // --- Logique ---

  onMapClick(targetCellId: number) {
    console.log('Déplacement vers la case :', targetCellId);

    // 1. Mise à jour de la position logique du joueur (ViewPoint)
    this.playerCellId.set(targetCellId);

    // 2. Mise à jour de l'entité visuelle
    this.entities.update(currentList => {
      // On crée une nouvelle liste en modifiant seulement l'allié
      return currentList.map(ent =>
        ent.type === EntityType.Ally
          ? { ...ent, cellId: targetCellId }
          : ent
      );
    });
  }

  toggleLos() {
    this.showLos.update(v => !v);
  }

  // --- Génération de Map de Démo ---
  private generateDemoMap(): MapData {
    const totalCells = this.MAP_WIDTH * this.MAP_HEIGHT;
    const cells: CellType[] = new Array(totalCells).fill(CellType.Floor);

    // On ajoute un peu de décor
    for (let i = 0; i < totalCells; i++) {
      const x = i % this.MAP_WIDTH;
      const y = Math.floor(i / this.MAP_WIDTH);

      // Création de trous sur les bords (pour faire une forme d'arène non carrée)
      if (x === 0 || x === this.MAP_WIDTH - 1 || y === 0 || y === this.MAP_HEIGHT - 1) {
        // Un trou sur deux sur les bords
        if ((x + y) % 3 === 0) cells[i] = CellType.Hole;
      }

      // Création d'un mur en forme de croix au centre
      const centerX = Math.floor(this.MAP_WIDTH / 2);
      const centerY = Math.floor(this.MAP_HEIGHT / 2);

      if ((x === centerX && Math.abs(y - centerY) < 3) ||
        (y === centerY && Math.abs(x - centerX) < 3)) {
        cells[i] = CellType.Wall;
      }

      // On retire le mur pile au centre pour laisser une ligne de vue "trou de serrure"
      if (x === centerX && y === centerY) {
        cells[i] = CellType.Floor;
      }
    }

    return {
      id: 1,
      width: this.MAP_WIDTH,
      height: this.MAP_HEIGHT,
      cells: cells
    };
  }
}
