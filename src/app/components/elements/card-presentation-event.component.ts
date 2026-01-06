import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuildEvent } from '../../data/guild-events/00-guild-events.data';
import { parseIso } from '../../utils/date.utils';

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
    <div class="group relative flex flex-col w-full max-w-3xl min-h-45
            bg-[#232323] rounded-2xl border border-white/5 shadow-2xl
            hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]
            hover:-translate-y-1 transition-all duration-300 cursor-pointer p-5 md:p-6">

      <div class="flex justify-between items-start gap-4 mb-3">
        <h3 class="text-lg md:text-xl text-text-surface-800 leading-tight group-hover:text-primary-400 transition-colors">
          {{ event().title }}
        </h3>

        <span class="shrink-0 px-3 py-1 rounded text-xs font-semibold uppercase border backdrop-blur-md"
              [ngClass]="statusClasses()">
      {{ statusLabel() }}
    </span>
      </div>

      <div class="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-3 shrink-0"></div>

      <div class="flex-1 mb-3">
        <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">
          {{ event().description }}
        </p>
        @if (event().startDate && event().endDate) {
          <p class="mt-2 text-xs text-gray-500 font-mono inline-flex items-center gap-2">
            <span>{{ parseIso(event().startDate) | date: 'dd/MM/yyyy HH:mm' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                 class="w-4 h-4 shrink-0">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span>{{ parseIso(event().endDate) | date: 'dd/MM/yyyy HH:mm' }}</span>
          </p>
        }
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
        return 'bg-green-500/10 text-green-600 border-green-400/80';
      case Status.UPCOMING:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/80';
      case Status.FINISHED:
      default:
        return 'bg-amber-600/10 text-amber-700 border-amber-600/80';
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

  protected readonly parseIso = parseIso;
}
