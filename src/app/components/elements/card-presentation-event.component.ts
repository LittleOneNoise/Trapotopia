import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuildEvent } from '../../data/guild-events.data';

enum Status {
  IN_PROGRESS = 'IN_PROGRESS',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
}

@Component({
  selector: 'trapotopia-card-presentation-event',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative flex flex-col h-full w-full max-w-2xl
            bg-[#232323] rounded-2xl border border-white/5 shadow-2xl
            hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]
            hover:-translate-y-1 transition-all duration-300 cursor-pointer p-6 md:p-8">

      <!-- Relief interne -->
<!--      <div-->
<!--        class="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-22px_45px_rgba(0,0,0,0.7)]"></div>-->

      <!-- Contour subtil -->
      <div
        class="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.20),transparent_20%,rgba(255,255,255,0.08))] opacity-50"></div>

      <div class="flex justify-between items-start gap-4 mb-4">
        <h3 class="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-primary-400 transition-colors">
          {{ event().title }}
        </h3>

        <span class="shrink-0 px-3 py-1 rounded text-xs font-semibold uppercase border backdrop-blur-md"
              [ngClass]="statusClasses()">
      {{ statusLabel() }}
    </span>
      </div>

      <div class="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-5 shrink-0"></div>

      <div class="flex-1 mb-6">
        <p class="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3">
          {{ event().description }}
        </p>
        @if (event().startDate) {
          <p class="mt-2 text-xs text-gray-500 font-mono">
            📅 {{ event().startDate }}
          </p>
        }
      </div>

      <div class="mt-auto flex items-center justify-end pt-4 border-t border-white/5">
    <span class="text-sm font-medium text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
      Voir les détails
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
           class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </span>
      </div>

    </div>
  `,
})
export class CardPresentationEventComponent {
  // On reçoit l'événement en entrée via un Signal
  event = input.required<GuildEvent>();

  // Calcul dynamique des classes CSS pour le badge de statut
  statusClasses = computed(() => {
    switch (this.computeStatus(this.event())) {
      case Status.IN_PROGRESS:
        return 'bg-green-600/60 text-gray-200 border-green-600/80';
      case Status.UPCOMING:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case Status.FINISHED:
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  });

  // Traduction du statut pour l'affichage
  statusLabel = computed(() => {
    switch (this.computeStatus(this.event())) {
      case Status.IN_PROGRESS: return 'En cours';
      case Status.UPCOMING: return 'À venir';
      case Status.FINISHED: return 'Terminé';
      default: return 'Inconnu';
    }
  });

  private computeStatus(evt: GuildEvent): Status {
    const now = new Date();
    const start = new Date(evt.startDate);
    const end = new Date(evt.endDate);

    if (now < start) {
      return Status.UPCOMING;
    } else if (now >= start && now <= end) {
      return Status.IN_PROGRESS;
    } else {
      return Status.FINISHED;
    }
  }
}
