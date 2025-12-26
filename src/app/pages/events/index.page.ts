import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardPresentationEventComponent } from '../../components/card-presentation-event.component';
import { GuildEvent, guildEventsData } from '../../data/guild-events.data';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CardPresentationEventComponent],
  template: `
    <div class="py-10 px-4 max-w-6xl mx-auto">

      <h1
        class="flex justify-self-center py-2 px-4 text-4xl md:text-5xl font-bold  mb-20 font-montserrat border-2 border-gray-500 rounded-full">
        2025
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        @for (evt of guildEventsData; track evt.slug) {
          <a [routerLink]="['/events', evt.slug]">
            <trapotopia-card-presentation-event [event]="evt">
            </trapotopia-card-presentation-event>
          </a>
        }
      </div>

    </div>


    <hr class="border-10 border-red-600"/>

    <!--    <div class="page-container min-h-screen bg-dofus-pattern p-6 md:p-12 text-white font-serif">-->

    <!--      <header class="text-center mb-12">-->
    <!--        <h1 class="text-4xl md:text-6xl font-bold text-dofus-gold drop-shadow-md mb-2">-->
    <!--          Livre des Événements-->
    <!--        </h1>-->
    <!--        <p class="text-gray-300 italic">Historique des exploits et festivités de la guilde</p>-->
    <!--      </header>-->

    <!--      @for (group of eventsByYear(); track group.year) {-->

    <!--        <section class="mb-16">-->
    <!--          <div class="flex items-center gap-4 mb-8">-->
    <!--            <div class="h-px bg-dofus-gold flex-1 opacity-50"></div>-->
    <!--            <h2-->
    <!--              class="text-3xl font-bold text-dofus-gold border-2 border-dofus-gold px-6 py-2 rounded-full bg-black/50">-->
    <!--              {{ group.year }}-->
    <!--            </h2>-->
    <!--            <div class="h-px bg-dofus-gold flex-1 opacity-50"></div>-->
    <!--          </div>-->

    <!--          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">-->
    <!--            @for (event of group.events; track event.slug) {-->

    <!--              <a [routerLink]="['/events', event.slug]"-->
    <!--                 class="group relative block bg-dofus-card-bg border border-gray-600 rounded-lg overflow-hidden hover:border-dofus-green hover:shadow-[0_0_15px_rgba(82,131,40,0.6)] transition-all duration-300 transform hover:-translate-y-1">-->

    <!--                <div class="h-48 overflow-hidden relative">-->
    <!--                  <img [src]="event.image" [alt]="event.title"-->
    <!--                       class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100">-->

    <!--                  <span [class]="event.status === 'open' ? 'bg-green-600' : 'bg-red-900'"-->
    <!--                        class="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded border border-white/20 shadow-md">-->
    <!--                    {{ event.status === 'open' ? 'EN COURS' : 'TERMINÉ' }}-->
    <!--                  </span>-->
    <!--                </div>-->

    <!--                <div class="p-5">-->
    <!--                  <h3 class="text-xl font-bold text-dofus-gold mb-2 group-hover:text-white transition-colors">-->
    <!--                    {{ event.title }}-->
    <!--                  </h3>-->
    <!--                  <p class="text-sm text-gray-400 line-clamp-2">-->
    <!--                    {{ event.description }}-->
    <!--                  </p>-->

    <!--                  <div class="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm">-->
    <!--                    <span class="text-dofus-green">Voir les détails</span>-->
    <!--                    <span class="text-gray-500">→</span>-->
    <!--                  </div>-->
    <!--                </div>-->

    <!--              </a>-->

    <!--            }-->
    <!--          </div>-->
    <!--        </section>-->
    <!--      }-->
    <!--    </div>-->
  `,
  styles: [`
    /* Suggestions de couleurs pour ton fichier Tailwind config */
    /* .text-dofus-gold { color: #dcb163; } */
    /* .text-dofus-green { color: #528328; } */
    /* .bg-dofus-card-bg { background-color: #1a1a1a; } */
  `]
})
export default class EventsIndexPage {

  // 1. Liste brute des events
  // Tu pourras déplacer ça plus tard dans un fichier .json ou un service
  rawEvents = signal<GuildEvent[]>([
    {
      slug: 'avent-2025',
      title: 'Le Calendrier de l\'Avent',
      year: 2025,
      description: '24 jours, 24 épreuves. Prouvez votre valeur et remportez des kamas pour la gloire de la guilde !',
      startDate: '2025-12-01T00:00:00Z',
      endDate: '2025-12-24T23:59:59Z'
    },
    // Exemple pour tester l'affichage multiple (tu peux le retirer)
    /*
    {
      slug: 'tournoi-pvp-2024',
      title: 'Tournoi PvP Inter-Guilde',
      year: 2024,
      image: '/assets/events/pvp-2024.jpg',
      status: 'closed',
      description: 'Un tournoi sanglant dans l\'arène de Bonta.'
    }
    */
  ]);

  // 2. Logique de regroupement par année (Computed)
  // Transforme la liste plate en : [{year: 2025, events: [...]}, {year: 2024, events: [...]}]
  eventsByYear = computed(() => {
    const events = this.rawEvents();

    // Récupère les années uniques et les trie (du plus récent au plus vieux)
    const years = [...new Set(events.map(e => e.year))].sort((a, b) => b - a);

    return years.map(year => ({
      year,
      events: events.filter(e => e.year === year)
    }));
  });
  protected readonly guildEventsData = guildEventsData;
}
