export interface GuildEvent {
  title: string;
  link: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const guildEvents: GuildEvent[] = [
  {
    'title': "Le Calendrier de l'Avent",
    'link': 'calendrier-avent-2025',
    'description': '24 jours, 24 épreuves. Prouvez votre valeur et remportez des kamas pour la gloire de la guilde !',
    'startDate': '2025-12-01T00:00:00Z',
    'endDate': '2025-12-24T23:59:59Z'
  },
  {
    'title': "Le Calendrier de l'Avent (Prolongation)",
    'link': 'calendrier-avent-prolongation-2025',
    'description': '24 jours, 24 épreuves. Prouvez votre valeur et remportez des kamas pour la gloire de la guilde !',
    'startDate': '2025-12-24T23:59:59Z',
    'endDate': '2026-01-12T23:59:59Z'
  },
  {
    'title': 'Galettes des Rwa',
    'link': 'galettes-des-rwa-2026',
    'description': 'Participez à la chasse aux fèves à travers le Monde des Douze et gagnez des récompenses royales !',
    'startDate': '2026-01-15T00:00:00Z',
    'endDate': '2026-01-22T23:59:59Z'
  },
  {
    'title': 'Saint Balotin',
    'link': 'saint-balotin-2026',
    'description': "Célébrez l'amour à votre façon en participant aux festivités de la Saint Balotin et remportez des cadeaux !",
    'startDate': '2026-02-10T00:00:00Z',
    'endDate': '2026-02-17T23:59:59Z'
  },
  {
    'title': 'Pâques ou pas quâpes ?',
    'link': 'paques-ou-pas-quapes-2026',
    'description': 'Retrouve les œufs cachés à travers le monde des Douze et gagne des récompenses exclusives !',
    'startDate': '2026-04-05T00:00:00Z',
    'endDate': '2026-04-12T23:59:59Z'
  }
];
