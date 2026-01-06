import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardPresentationEventComponent } from '../../components/elements/card-presentation-event.component';
import { GuildEvent, guildEvents } from '../../data/guild-events/00-guild-events.data';
import { getYearFromIso, parseIso } from '../../utils/date.utils';

interface EventsByYear {
  year: number;
  events: GuildEvent[];
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CardPresentationEventComponent],
  template: `
    <div class="py-10 px-4 max-w-6xl mx-auto text-text-surface-800">

      @for (group of eventsByYear; track group.year) {
        <h1
          class="flex justify-self-center py-2 px-4 text-3xl md:text-4xl">
          {{ group.year }}
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 text-text-surface-800 mb-10">
          @for (evt of group.events; track evt.link) {
            <a [routerLink]="['/events', evt.link]">
              <trapotopia-card-presentation-event [event]="evt">
              </trapotopia-card-presentation-event>
            </a>
          }
        </div>
      }

    </div>
  `,
})
export default class EventsIndexPage {
  public eventsByYear: EventsByYear[] = this.groupEventsByYear();

  private groupEventsByYear(): EventsByYear[] {
    // Trier les événements par date (plus récent en premier)
    const sortedEvents = [...guildEvents].sort((a, b) => {
      const dateA = parseIso(a.startDate);
      const dateB = parseIso(b.startDate);
      if (!dateA || !dateB) return 0;
      return dateB.getTime() - dateA.getTime();
    });

    // Grouper par année
    const groupedMap = new Map<number, GuildEvent[]>();
    for (const event of sortedEvents) {
      const year = getYearFromIso(event.startDate);
      if (year) {
        if (!groupedMap.has(year)) {
          groupedMap.set(year, []);
        }
        groupedMap.get(year)!.push(event);
      }
    }

    // Convertir en tableau trié par année décroissante
    return Array.from(groupedMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, events]) => ({ year, events }));
  }
}
