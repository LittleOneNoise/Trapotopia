export interface GuildEvent {
  slug: string;
  title: string;
  description: string;
  year: number;
  startDate: string;
  endDate: string;
}

export const guildEventsData : GuildEvent[] = [
  {
    title: 'Le Calendrier de l\'Avent',
    slug: 'avent-2025',
    description: '24 jours, 24 épreuves. Prouvez votre valeur et remportez des kamas pour la gloire de la guilde !',
    year: 2025,
    startDate: '2025-12-01T00:00:00Z',
    endDate: '2025-12-24T23:59:59Z',
  },
  {
    title: 'Paques ou pas paque',
    slug: 'paques-2026',
    description: 'Retrouve les œufs cachés à travers le monde des Douze et gagne des récompenses exclusives !',
    year: 2026,
    startDate: '2026-04-01T00:00:00Z',
    endDate: '2026-04-30T23:59:59Z',
  },
  {
    title: 'Vulka 2024',
    slug: 'vulka-2024',
    description: 'Participez au grand tournoi de Vulka et montrez votre bravoure dans l\'arène !',
    year: 2024,
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-04-30T23:59:59Z',
  },
];
