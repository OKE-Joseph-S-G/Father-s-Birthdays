export interface TimelineItem {
  year: string
  title: string
  description: string
}

export interface Message {
  name: string
  relation: string
  text: string
  emoji: string
}

export interface Theme {
  id: 'papa' | 'irene'
  name: string
  shortName: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthLabel: string
  yearsRange: string
  accent: string
  accentRgb: string
  accentLight: string
  greeting: string
  subtext: string
  lifeStatsLabel: string
  timelineTitle: string
  timelineSubtitle: string
  timeline: TimelineItem[]
  letterSalutation: string
  letterBody: string[]
  letterSign: string
  messages: Message[]
  finalWish: string[]
  finalSign: string
  footer: string
  galleryImages: string[]
}

export const themes: Record<string, Theme> = {
  papa: {
    id: 'papa',
    name: 'Papa',
    shortName: 'Papa',
    birthYear: 1978,
    birthMonth: 0,
    birthDay: 1,
    birthLabel: '1er Janvier 1978',
    yearsRange: '1978 — 2026',
    accent: '#d4af37',
    accentRgb: '212, 175, 55',
    accentLight: '#f0d060',
    greeting: 'Joyeux Anniversaire',
    subtext: 'Avec tout mon amour',
    lifeStatsLabel: 'Le volume d\'une vie',
    timelineTitle: 'Une Vie Extraordinaire',
    timelineSubtitle: 'Son parcours',
    timeline: [
      { year: '1978', title: 'La naissance d\'un héros', description: 'Le jour où le monde a gagné une personne extraordinaire.' },
      { year: '1998', title: 'Jeune & Ambitieux', description: 'Le début d\'une belle aventure, pleine de rêves et de détermination.' },
      { year: '2005', title: 'Fondation', description: 'La création de notre famille, le plus beau des cadeaux.' },
      { year: '2010', title: 'Années de croissance', description: 'Chaque jour une nouvelle leçon, chaque année un nouveau souvenir.' },
      { year: '2020', title: 'Force & Sagesse', description: 'Prouver que rien ne peut arrêter un cœur déterminé.' },
      { year: '2026', title: 'Joyeux Anniversaire !', description: '48 ans de bonheur partagé. Le meilleur reste à venir !' },
    ],
    letterSalutation: 'Mon cher Papa,',
    letterBody: [
      'Aujourd\'hui, on ne célèbre pas seulement ta naissance. On célèbre tout ce que tu es : un père dévoué, un homme courageux, et la personne la plus inspirante que je connaisse.',
      'Chaque sacrifice que tu as fait, chaque nuit que tu veilles, chaque sourire que tu nous offres... tout cela n\'est pas passé inaperçu.',
      'Ce site, c\'est mon petit geste pour te dire que je suis ravi de t\'avoir comme père. Fier d\'être ton enfant.',
    ],
    letterSign: 'Avec tout mon amour,\nTon enfant qui t\'aime ❤️',
    messages: [
      { name: 'Maman', relation: 'Épouse', text: 'Merci d\'être le pilier de notre famille. Tu es l\'homme le plus incroyable que je connaisse. Je t\'aime.', emoji: '❤️' },
      { name: 'Tes enfants', relation: 'Fils & Fille', text: 'Papa, tu es notre héros. Merci pour tout l\'amour, la patience et les fous rires. Joyeux anniversaire !', emoji: '🎉' },
      { name: 'Ta famille', relation: 'Parents & Frères/Sœurs', text: 'Depuis 1978, tu illuminés nos vies. Que Dieu te bénisse pour de longues et belles années.', emoji: '🙏' },
      { name: 'Tes amis', relation: 'Les amis fidèles', text: 'Un homme droit, généreux et toujours prêt à aider. Tu mérites le meilleur. Joyeux anniversaire !', emoji: '🥂' },
    ],
    finalWish: [
      'Papa, tu es bien plus qu\'un père.',
      'Tu es un héros, un modèle, et la plus belle bénédiction de nos vies.',
      'Que cette nouvelle année t\'apporte tout le bonheur que tu mérites.',
    ],
    finalSign: 'Joyeux Anniversaire, Papa !',
    footer: 'Fait avec ❤️ pour Papa — 2026',
    galleryImages: [],
  },

  irene: {
    id: 'irene',
    name: 'Irène',
    shortName: 'Aunt IRENE',
    birthYear: 1992,
    birthMonth: 6,
    birthDay: 21,
    birthLabel: '21 Juillet 1992',
    yearsRange: '1992 — 2026',
    accent: '#e8a0bf',
    accentRgb: '232, 160, 191',
    accentLight: '#f5c6d8',
    greeting: 'Joyeux Anniversaire',
    subtext: 'De la part de ton petit frère',
    lifeStatsLabel: 'Le volume de ta vie',
    timelineTitle: 'Une Vie Magnifique',
    timelineSubtitle: 'Ton parcours',
    timeline: [
      { year: '1992', title: 'L\'arrivée d\'une étoile', description: 'Le jour où le monde s\'est enrichi d\'une femme extraordinaire.' },
      { year: '2000', title: 'Enfance lumineuse', description: 'Une petite fille pleine de vie, de rires et de rêves.' },
      { year: '2008', title: 'Jeunesse & Ambition', description: 'Le début d\'un chemin unique, marqué par la détermination.' },
      { year: '2014', title: 'L\'envol', description: 'La construction de ton propre chemin, avec courage et grâce.' },
      { year: '2020', title: 'Force & Elegance', description: 'Prouver que rien ne peut éteindre la lumière d\'une femme forte.' },
      { year: '2026', title: 'Joyeux Anniversaire !', description: '34 ans de bonheur partagé. Tu es unique, Irène !' },
    ],
    letterSalutation: 'Chère Irène,',
    letterBody: [
      'Aujourd\'hui, on célèbre pas seulement ta naissance. On célèbre tout ce que tu es : une sœur aimante, une femme extraordinaire, et la plus belle bénédiction de ma vie.',
      'Chaque moment partagé, chaque fous rire, chaque soutien que tu m\'as apporté... tout cela compte plus que tu ne le crois.',
      'Ce site, c\'est mon petit geste pour te dire que je suis fier d\'être ton petit frère. Tu es unique, Irène.',
    ],
    letterSign: 'Avec tout mon amour,\nTon petit frère qui t\'aime ❤️',
    messages: [
      { name: 'Ta famille', relation: 'Les parents', text: 'Irène, tu es notre fierté. Chaque jour, tu nous montres ce que c\'est d\'être forte et aimante. Joyeux anniversaire !', emoji: '❤️' },
      { name: 'Ton petit frère', relation: 'Frère & Nephew', text: 'Ma sœur, mon modèle, mon amie. Merci d\'être toujours là. Je t\'aime plus que les mots ne peuvent le dire.', emoji: '🎉' },
      { name: 'Tes proches', relation: 'Amis & Famille', text: 'Une femme au cœur d\'or, toujours souriante, toujours généreuse. Que Dieu te bénisse pour de longues années.', emoji: '🙏' },
      { name: 'Ceux qui t\'aiment', relation: 'Les fidèles', text: 'Irène, tu illumines chaque pièce où tu entres. Le meilleur reste à venir. Joyeux anniversaire !', emoji: '🥂' },
    ],
    finalWish: [
      'Irène, tu es bien plus qu\'une sœur.',
      'Tu es un modèle, une confidente, et la plus belle bénédiction de ma vie.',
      'Que cette nouvelle année t\'apporte tout le bonheur que tu mérites.',
    ],
    finalSign: 'Joyeux Anniversaire, Irène !',
    footer: 'Fait avec ❤️ pour Irène — 2026',
    galleryImages: [
      '/images/aunt/IMG-20260712-WA0007.jpg',
      '/images/aunt/IMG-20260712-WA0008.jpg',
      '/images/aunt/IMG-20260712-WA0009.jpg',
      '/images/aunt/IMG-20260712-WA0011.jpg',
      '/images/aunt/IMG-20260712-WA0012.jpg',
      '/images/aunt/IMG-20260712-WA0013.jpg',
      '/images/aunt/IMG-20260712-WA0015.jpg',
      '/images/aunt/IMG-20260712-WA0016.jpg',
      '/images/aunt/IMG-20260712-WA0018.jpg',
      '/images/aunt/IMG-20260712-WA0019.jpg',
      '/images/aunt/IMG-20260712-WA0025.jpg',
    ],
  },
}
