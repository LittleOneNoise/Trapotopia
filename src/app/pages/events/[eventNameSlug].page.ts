import { Component, computed, input, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { avent2025EventChallenges, AventEventChallenge } from '../../data/avent-2025-event.data';

// Interface pour tes données (à mettre dans un fichier à part idéalement)
interface Epreuve {
  jour: number;
  titre: string;
  description: string;
  image?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dofus-container flex h-screen gap-4 p-4">

      <aside class="w-1/3 bg-dofus-dark p-4 rounded-xl overflow-y-auto">
        <h2 class="text-gold mb-4 text-xl font-bold">Décembre 2025</h2>
        <div class="grid grid-cols-4 gap-2">
          @for (epreuve of epreuves; track epreuve.jour) {
            <button
              (click)="selectDay(epreuve.jour)"
              [class.border-gold]="currentDay() === epreuve.jour"
              class="h-12 w-12 bg-dofus-cell border-2 border-dofus-border rounded flex items-center justify-center hover:bg-dofus-hover transition">
              {{ epreuve.jour }}
            </button>
          }
        </div>
      </aside>

      <main class="w-2/3 bg-parchment p-8 rounded-xl relative shadow-lg text-dofus-text">
        @if (selectedEpreuve(); as ev) {
          <h1 class="text-3xl font-serif text-dofus-title mb-6">{{ ev.title }}</h1>

          <div class="mb-4">
            @for (rule of ev.rulesList; track rule) {
            <p class="text-lg">{{ rule }}</p>
            }
          </div>

          <div class="mb-4">
            @for (imageLink of ev.imagesLinks; track imageLink) {
              <img [src]="imageLink"  [alt]="imageLink"/>
            }
          </div>

          <div class="mb-4">
            @for (bonusInfo of ev.bonusInfos; track bonusInfo) {
              <p class="text-sm italic">{{ bonusInfo }}</p>
            }
          </div>

          <div class="mb-4">
              <p class="text-sm">Debut: {{ ev.startDate | date: 'DD/MM/YYYY HH:MM:ss' }}</p>
            <p class="text-sm">Debut: {{ ev.endDate | date: 'DD/MM/YYYY HH:MM:ss' }}</p>
          </div>

          <button (click)="shareEpreuve()" class="bg-dofus-green text-white px-4 py-2 rounded mt-8">
            🔗 Partager cette épreuve
          </button>
        } @else {
          <p class="text-center italic">Sélectionnez un jour dans le calendrier...</p>
        }
      </main>

    </div>
  `,
  styles: [`
    /* Exemples de classes utilitaires custom */
    .bg-parchment { background-color: #fdf5e6; color: #3b3b3b; }
    .text-gold { color: #ffd700; }
    .border-gold { border-color: #ffd700; box-shadow: 0 0 10px #ffd700; }
  `]
})
export default class EventPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Simulation de données (à remplacer par un fetch ou un fichier JSON)
  epreuves: Epreuve[] = Array.from({ length: 24 }, (_, i) => ({
    jour: i + 1,
    titre: `Épreuve du ${i + 1} Décembre`,
    description: `Voici la tâche à accomplir pour le jour ${i + 1}. Ramenez 10 laines de Bouftou !`
  }));

  // Récupère le paramètre "?jour=" de l'URL de manière réactive
  // Si pas de jour, retourne null ou 1 par défaut
  queryParams = toSignal(this.route.queryParams);

  currentDay = computed(() => {
    const params = this.queryParams();
    return params ? Number(params['jour']) : null;
  });

  // Trouve l'épreuve correspondant au jour sélectionné
  selectedEpreuve: Signal<AventEventChallenge | undefined> = computed(() =>
    avent2025EventChallenges.find(e => e.day === this.currentDay())
  );

  // Change l'URL sans recharger la page
  selectDay(jour: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { jour: jour },
      queryParamsHandling: 'merge', // Garde les autres params s'il y en a
    });
  }

  shareEpreuve() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => alert('Lien copié dans le presse-papier !'));
  }
}
