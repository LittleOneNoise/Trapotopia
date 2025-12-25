export interface AventEventChallenge {
  day: number;
  title: string;
  rulesList?: string[];
  imagesLinks?: string[];
  bonusInfos?: string[];
  startDate: string; // Respecter format ISO 8601 : YYYY-MM-DDTHH:mm:ssZ
  endDate: string; // Respecter format ISO 8601 : YYYY-MM-DDTHH:mm:ssZ
}

export const avent2025EventChallenges: AventEventChallenge[] = [
  {
    day: 1,
    title: 'Speedrun Kardorim',
    rulesList: [
      "Création d'un personnage -> finir le dj Kardorim le plus vite possible",
      "Filmer depuis la création du perso jusqu'à la victoire",
      'Aucun stuff autorisé à part le stuff du tuto',
      'Interdiction de quitter Incarnam',
      'Les classes créées doivent être les mêmes que celles annoncées dans le salon events'
    ],
    bonusInfos: [
      'Si vous avez les slots saturés, n’hésitez pas à créer un compte ! (Ça prend 2 minutes)',
      'Si vous êtes en xp x2,3 ou 4, vous devez créer un personnage sur un autre serveur en xp x1. Si pas de serveur dispo en x1, créer un compte.'
    ],
    startDate: '2025-12-01T00:00:00Z',
    endDate: '2025-12-01T23:59:59Z',
  },
  {
    day: 2,
    title: 'Tournoi PvP (8èmes de finale)',
    rulesList: [
      "Les combats doivent s'effectuer en [-1, 0], en 2v2 sauf exception",
      "Tout est autorisé en terme d'équipements sauf ceux interdits de base dans l'évent, aucun consommables acceptés",
      'Le combat devra être filmé par au moins une personne de chaque duo, et absolument tout le combat doit y figuré',
      "Les duos avec un joueur inférieur au niveau 200 se verront offrir un avantage par souci d'égalité, cet avantage se résume en 2 points :",
      'Les joueurs 200 de la/des teams adverses devront passer leur 1er tour de jeu',
      'Le joueur inférieur au niveau 200 et uniquement lui aura le droit de mettre un Inferno ou un Laikteur qui sera prêté par un organisateur',
      'Les 8èmes de finales sont :',
      'TEAM 10 VS TEAM 15',
      'TEAM 4 VS TEAM 14',
      'TEAM 13 VS TEAM 5',
      'TEAM 16 VS TEAM 11',
      'TEAM 6 VS TEAM 8',
      'TEAM 7 VS TEAM 1',
      'TEAM 3 VS TEAM 9',
      'TEAM 2 VS TEAM 12'
    ],
    startDate: '2025-12-02T00:00:00Z',
    endDate: '2025-12-11T23:59:59Z',
  },
  {
    day: 3,
    title: 'Défi de la reine Éléonore',
    rulesList: [
      'La reine Éléonore vous impose un défi en ce jour spécial du 3 décembre qui est son jour de naissance un an en arrière. ',
      '« Allez combattre le Founoroshi ! Mais pas seuls, avec une équipe adverse pour pimenter cette épreuve ! »',
      '« Je vais regarder ces combats avec les meilleurs popcorns que m’a donné mon papa ! » dit-elle',
      'Donjon Founoroshi - 2 x 2 teams PVPVE',
      'Interdictions basique de l’event + interdiction de frapper la team adverse tant que le boss n’est pas delock',
      'S’entraider jusqu’au delock du boss',
      'Lors du delock, possibilité de fight la team adverse',
      'Le joueur qui acheve founoroshi remporte l’épreuve',
      'Founoroshi doit être achevé en dernier. (Il faut tuer les 3 mobs avant)',
      'Founoroshi devra seulement être frappé par un corps à corps en ligne avec lui. (Exemple : Yaularc mais en ligne)'
    ],
    bonusInfos: [
      'Vous pouvez, comme l’épreuve PvP, prendre un compagnon inferno ou Laikteur (attention cela augmentera de un le nombre de mob pour le combat)',
      'Vous pouvez taper Founoroshi avec vos sorts, mais attention, toujours en ligne avec celui ci!',
    ],
    startDate: '2025-12-03T00:00:00Z',
    endDate: '2025-12-09T23:59:59Z',
  },
  {
    day: 4,
    title: 'La patate du forain',
    rulesList: [
      "Tout est autorisé en termes d'équipements sauf le CAC et ceux interdits de base dans l'event, aucun consommables acceptés",
      "La team qui tapera le donjon le plus compliqué en tuant le boss à la fin a l’aide de votre CAC c'est-à-dire un boooon coup de poing gagnera l'épreuve",
      'Vous pouvez taper n’importe quel donjon à condition de pouvoir terminer le boss avec un coup de poing',
      'Tous les duos ayant fait un donjon se verra attribuer des points par rapport à la difficulté de ce dernier (la table de difficulté est fixée par les 4 organisateurs et ne sera pas dévoilée)',
      'Les duos qui ont dans leur team un perso -de 200 pourront utiliser un compagnon, uniquement le joueur qui n’est pas 200. Interdiction de tuer le boss avec le compagnon'
    ],
    bonusInfos: [
      'Petite précision les 2 duos avec un joueur inférieur au lvl 200 auront droit à une majoration de points sur cette épreuve (le taux ne sera pas dévoilé bien évidemment) !',
      'Les deux joueurs de chaque équipe doivent déséquiper le cac au boss ! ',
      '13 Donjons donnent le plus de points',
      '10 un peu moins...',
      'x un peu moins',
      'xx un peu moins....'
    ],
    startDate: '2025-12-04T00:00:00Z',
    endDate: '2025-12-07T23:59:59Z',
  },
  {
    day: 5,
    title: 'Need a DOC-tor',
    rulesList: [
      'Dropper la ressource la plus cher possible selon le barème suivant :',
      'xx points pour une ressource valant plus que 5 millions de kamas.',
      'x points pour une ressource valant entre 1 million et 4.999.999 kamas.',
      'x points pour une ressource valant entre 500.000 et 999.999 kamas.',
      'x points pour une ressource valant entre 100.000 et 499.999 kamas.',
      '1 points pour toute participation',
      'Tous les équipements sont autorisés, or ceux déjà interdits dans l’événement. Aucun consommable n’est accepté.',
      'L’équipe qui obtiendra la ressource la plus rare remportera l’épreuve.',
      'Vous pouvez tenter d’obtenir un drop par nimporte quel moyen sauf interdictions de base évidemment.',
      'Si plusieurs équipes obtiennent la même ressource, les deux équipes seront ex-aequo.',
      'Les duos comptant un personnage de niveau inférieur à 200 sont autorisés à utiliser un seul compagnon.',
      "Il faudra envoyer le screen de l'écran de fin de combat avec la visualisation du nom de la ressource et du prix moyen, avec un autre screen qui montre le prix HDV",
      "Bien évidemment aucune manipulation d'un prix d'une ressource n'est acceptée."
    ],
    bonusInfos: [
      "Comme la PLUPART DES duos ont pu évoqué le fait de farm des anomalies, je tiens à préciser que l'élixir uchronique est un consommable et est donc interdit"
    ],
    startDate: '2025-12-05T00:00:00Z',
    endDate: '2025-12-09T23:59:59Z'
  },
  {
    day: 6,
    title: 'Antichambre du Korriandre',
    rulesList: [
      'Réaliser le Donjon Korriandre de façon suivante :',
      'Chaque monstre (de la salle boss) devra dans un premier temps être frappé au cac avec une flamiche.',
      'Une fois frappé, ce même joueur peut continuer à le taper MAIS à 4 po minimum de lui.',
      'Les deux joueurs de chaque équipe doivent respecter les deux règles ci-dessus, et ce chaque tour.',
      'Les joueurs inférieurs au lvl 200 pourront utiliser un des deux compagnons habituels. Le compagnon pourra seulement taper une fois à distance.',
      "Le donjon réalisé de sorte, valide l'épreuve."
    ],
    startDate: '2025-12-06T00:00:00Z',
    endDate: '2025-12-12T23:59:59Z'
  },
  {
    day: 7,
    title: "Nikov's run",
    rulesList: [
      'Le but : Effectuer une run Cauchemar 1 avec achat à 2 ou à 4 (donc possibilité de coopération entre 2 duos) en mode REVERSED !!!',
      "Pas de règles à part finir la run pour valider l'épreuve",
      "Pour lancer une run en mode REVERSED, il faut sélectionner Cauchemar 1 dans la sélection de difficulté, puis à gauche vous avez la possibilité d'appuyer sur Souvenir, puis vous écrivez REVERSED pour lancer la run",
      'Cette run est très facile et fun, à 2 ça devrait vous prendre 1h et à 4 je dirais 40 minutes',
      'On vous laisse découvrir le but de la run et en profiter un maximum !'
    ],
    startDate: '2025-12-07T00:00:00Z',
    endDate: '2025-12-22T23:59:59Z'
  },
  {
    day: 8,
    title: 'Cache-cache',
    rulesList: [
      "Le but : trouver un membre de l'orga sur une map précise",
      "Les duos seront pris 1 par 1 pour pas avoir besoin d'avoir tous les participants dispo au même moment"
    ],
    startDate: '2025-12-08T00:00:00Z',
    endDate: '2025-12-22T23:59:59Z'
  },
  {
    day: 9,
    title: "Défi : La roulette crit'",
    rulesList: [
      'Vous allez devoir faire le Donjon Tournesol en Duo mais interdiction de taper les mobs (dans toutes les salles et boss)',
      "Vous devez invoquer un chafer crit et le laisser taper, bien évidemment vous devez prendre la variante du chafer crit de base en espérant que vous fassiez un crit sinon vous le tuez et vous recommencez jusqu'à invoquer un chafer crit",
      'Pour valider il me faut juste un rec de tout le donjon (salles comprises)'
    ],
    startDate: '2025-12-09T00:00:00Z',
    endDate: '2025-12-22T23:59:59Z'
  },
  {
    day: 10,
    title: 'Kaizen 2',
    rulesList: [
      'Le but : faire le plus de donjons unique de frigost en moins de 2 heures (du RM au Comte sans faire dazak et proto mais Grolloum compte)',
      'Tout est autorisé sauf les équipements et consommables interdits de base'
    ],
    bonusInfos: [
      "Pour que vos donjons soient pris en compte, vous devez absolument les réaliser dans l'ordre suivant : Royalmouth, Mansot Royal, Ben le Ripate, Obsidiantre, Tengu Givrefoux, Korriandre, Kolosso, Glourscéleste, Grolloum, Nileza, Sylargh, Klime, Missiz Frizz, Comte Harebourg. Tout donjon effectué hors de cet ordre ne sera pas validé pour l'épreuve."
    ],
    startDate: '2025-12-10T00:00:00Z',
    endDate: '2025-12-22T23:59:59Z'
  },
  {
    day: 11,
    title: 'Popcorns factory',
    rulesList: [
      'Prévenir de votre participation imminente à un organisateur afin de récupérer votre lot de popcorns auprès de lui.',
      "Le but est d'effectuer le plus d'échanges possibles durant 30 minutes. (inconnus, guildeux, amis... -> libre à vous d'aider, ou non, les équipes adverses ! 😈) Le chronomètre sera géré par un organisateur.",
      "Si vous ramenez au moins un (et seulement un autorisé) screen d'un échange contre 500.000 kamas minimum, cela rapportera un point supplémentaire.",
      "Veuillez envoyer à @Unesemaine ou autre organisateur, le plus de screens possible (validés au préalable par l'acheteur). -> Il y aura un top 3 ainsi qu'une mention spéciale à celui qui aura récolté le plus de kamas."
    ],
    bonusInfos: [
      "Il faut en échanger/donner/vendre un maximum a des personnes différentes à chaque fois. Deux screens (ou plus) d'un échange avec le même joueur ne comptera que pour un."
    ],
    startDate: '2025-12-11T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 12,
    title: 'Tournoi PvP (Quarts de finale)',
    rulesList: [
      "Les combats doivent s'effectuer en [-1, 0], en 2v2 sauf exception",
      "Tout est autorisé en terme d'équipements sauf ceux interdits de base dans l'évent, aucun consommables acceptés",
      'Le combat devra être filmé par au moins une personne de chaque duo, et absolument tout le combat doit y figuré',
      "Les duos avec un joueur inférieur au niveau 200 se verront offrir un avantage par souci d'égalité, cet avantage se résume en 2 points :",
      'Les joueurs 200 de la/des teams adverses devront passer leur 1er tour de jeu',
      'Le joueur inférieur au niveau 200 et uniquement lui aura le droit de mettre un Inferno ou un Laikteur qui sera prêté par un organisateur',
      'Les quarts de finales sont : TEAM 5 VS TEAM 9',
      'TEAM 14 VS TEAM 16',
      'TEAM 12 VS (Gagnant du combat TEAM 1 VS TEAM 11)',
      'TEAM 8 VS (Gagnant du combat TEAM 2 VS TEAM 10)'
    ],
    startDate: '2025-12-12T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 13,
    title: 'Challenge : Statue Mouvementée',
    rulesList: [
      'Donjon Bworker',
      'Salle boss : challenge statue + durant ton tour de jeu tu dois bouger au moins une fois ton équipier. (Attirance, transpo, pousser, jeter)',
      'Le Bworker doit être achevé en 2e.',
      'Les joueurs inférieurs à 200 peuvent utiliser un compagnon chevalier d’Astrub (ou autre)',
      'Valider le combat de sorte, valide l’épreuve.'
    ],
    startDate: '2025-12-13T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 14,
    title: 'QUIZ',
    rulesList: [
      "Une annonce aura lieu à un moment pour mieux vous expliquer, mais en gros c'est un quiz en rapport avec Dofus"
    ],
    startDate: '2025-12-14T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 15,
    title: 'Roro Hobby',
    rulesList: [
      "Comte Harebourg B6 ou B8 en coopération avec d'autres duo (pour les -200 qui n'ont pas accès, go voir en DM avec un orga)"
    ],
    startDate: '2025-12-15T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 16,
    title: 'Qui à la best classe',
    rulesList: [
      'Celui qui tapera le dj le plus compliqué avec UNIQUEMENT ses items de classe'
    ],
    startDate: '2025-12-16T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 17,
    title: 'Tournoi PvP (demies finales)',
    rulesList: [
      '2v2 map aggro.'
    ],
    startDate: '2025-12-17T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 18,
    title: 'Trouve la map',
    rulesList: [
      'Trouve la map précise depuis une image'
    ],
    imagesLinks: [
      '/avent-2025/jour-18-map.png',
    ],
    startDate: '2025-12-18T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 19,
    title: 'Trouve le mob',
    rulesList: [
      'Trouve le mob depuis une image'
    ],
    imagesLinks: [
      '/avent-2025/jour-19-mob.png',
    ],
    startDate: '2025-12-19T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 20,
    title: 'Challenge : Raser Tout le mur',
    rulesList: [
      'Donjon Père Ver',
      'Challenge : il faut réaliser un tour entier de la map en longeant ses extrémités avant de pouvoir achever le boss.',
      'Un personnage du groupe seulement doit réaliser le tour. (Après si ça vous amuse de raser le mur à deux, main dans la main ... roulez jeunesse !)',
      'Attention, seulement en utilisant des PM, pas de sorts autorisés pouvant vous aider. (Exemple : boost PM, TP, attirance, RIEN)',
      'Les joueurs < 200 peuvent utiliser un compagnon. Le compagnon ne peut pas réaliser le tour de la map.'
    ],
    startDate: '2025-12-20T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 21,
    title: "L'épreuve du beauf ultime",
    rulesList: [
      "Le duo qui réalisera le plus gros zgeg en disposant des ressources au sol remportera l'épreuve.",
      'Toutes les ressources peuvent être posées au sol pour former le zgeg.',
      'Tous les coups sont permis : voler, déplacer, ramasser les ressources des autres duos est autorisé.',
      'Les créations peuvent être sabotées à tout moment.'
    ],
    bonusInfos: [
      "Il peut y avoir des obstacles sur la map mais pas à l'intérieur de votre œuvre"
    ],
    startDate: '2025-12-21T00:00:00Z',
    endDate: '2025-12-22T23:59:00Z'
  },
  {
    day: 22,
    title: 'Tournoi PvP (Finale + possibilité de doubler la mise)',
    rulesList: [
      '2v2 map aggro, les gagnants pourront tenter de battre le duo des organisateurs pour doubler leurs récompenses'
    ],
    startDate: '2025-12-22T00:00:00Z',
    endDate: '2025-12-23T23:59:00Z'
  },
  {
    day: 23,
    title: "L'Algorithme des 168 Heures",
    rulesList: [
      "\"Aventuriers, l'histoire n'est pas qu'un récit, c'est une boussole. Pour trouver le portail qui vous permettra de lever les voiles sur votre passé, vous devez extraire les chiffres cachés dans les légendes de notre monde.\"",
      "I. La Clef de l'Horizon",
      "Prenez le nombre de \"grandes\" Nations de l'Âge des Dofus",
      'Multipliez ce chiffre par le nombre de Dofus Primordiaux.',
      "À ce résultat, soustrayez le nombre de Cavaliers de l'Eliocalypse qui ont annoncé la fin des temps.",
      'Enfin, soustrayez 4.',
      "II. La clef de l'Abîme",
      "Prenez l'année exacte de l'Aurore Pourpre.",
      "Soustrayez-lui l'âge auquel le héros Rykke Errel est mort en affrontant le dragon Bolgrot.",
      "Retranchez ensuite le nombre de Gardiens des Mois qui veillent sur l'année.",
      'Soustrayez 13.'
    ],
    startDate: '2025-12-23T00:00:00Z',
    endDate: '2025-12-23T23:59:00Z'
  }
];
