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
    'title': 'Pâques ou pas quâpes ?',
    'link': 'paques-ou-pas-quapes-2026',
    'description': 'Retrouve les œufs cachés à travers le monde des Douze et gagne des récompenses exclusives !',
    'startDate': '2026-04-05T00:00:00Z',
    'endDate': '2026-04-12T23:59:59Z'
  }
];
