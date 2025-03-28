export type ChorusType = 'harmony' | 'melody' | null;

export interface ChorusContent {
  id: ChorusType;
  fullName: string;
  shortDescription: string;
  longDescription: string;
  logoPath: string;
  primaryColor: string;
  bannerImages: {
    home: string;
    about: string;
    events: string;
    media: string;
    join: string;
    contact: string;
    leadership: string;
  };
  aboutContent: {
    missionStatement: string;
    history: string;
    whatWeDo: string;
  };
  achievements: {
    title: string;
    description: string;
  }[];
}

const chorusContent: Record<string, ChorusContent> = {
  harmony: {
    id: 'harmony',
    fullName: 'Parkside Harmony',
    shortDescription: 'Award-winning men\'s a cappella chorus performing in the barbershop tradition.',
    longDescription: 'Parkside Harmony is an award-winning men\'s a cappella chorus based in Hershey, PA. Founded in 2009, we perform in the barbershop style and are dedicated to musical excellence and community engagement through our performances.',
    logoPath: '/images/parkside-harmony-logo.png', // Using the new harmony logo
    primaryColor: '#1E40AF', // indigo-800
    bannerImages: {
      home: '/images/harmony-bg.jpg', // Tagged as "harmony"
      about: '/images/harmony/about/hero.jpg', // Updated image for harmony about
      events: '/images/harmony/hero/events-hero.jpg', // Hero image for harmony events
      media: '/images/harmony/hero/media-hero.jpg', // Hero image for harmony media
      join: '/images/join-hero.jpg', // Tagged as "both"
      contact: '/images/harmony/hero/contact-hero.jpg', // Hero image for harmony contact
      leadership: '/images/leadership-hero.jpg' // Tagged as "harmony"
    },
    aboutContent: {
      missionStatement: "Parkside Harmony's mission is to enrich lives through exceptional vocal music, preserving and advancing the barbershop harmony tradition with artistic and cultural significance.",
      history: "Parkside Harmony was founded in 2009 by a group of dedicated singers committed to musical excellence. Since then, we've grown into one of the Mid-Atlantic District's premier men's choruses, earning multiple district championships and competing on the international stage.",
      whatWeDo: "We perform throughout the year at community events, private functions, and competitions. Our repertoire spans from classic barbershop to contemporary arrangements, all performed with the distinctive close harmony that defines the barbershop style."
    },
    achievements: [
      {
        title: 'Mid-Atlantic District Champions',
        description: 'Multiple-time champions of the Mid-Atlantic District barbershop competition.',
      },
      {
        title: 'International Competitors',
        description: 'Representing the Mid-Atlantic District on the international stage.',
      },
      {
        title: 'Community Impact',
        description: 'Bringing the joy of barbershop harmony to communities throughout Pennsylvania.',
      },
    ],
  },
  melody: {
    id: 'melody',
    fullName: 'Parkside Melody',
    shortDescription: 'Exceptional treble chorus bringing vibrant a cappella performances to the Hershey area.',
    longDescription: 'Parkside Melody is a treble chorus dedicated to excellence in a cappella singing. Based in Hershey, PA, we bring together singers of all ages to create beautiful harmony and foster musical growth in the treble voice.',
    logoPath: '/images/parkside-melody-logo.png', // Using the new melody logo
    primaryColor: '#BE185D', // pink-700
    bannerImages: {
      home: '/images/melody-bg.jpg', // Tagged as "melody"
      about: '/images/melody/about/hero.jpg', // Updated image for melody about
      events: '/images/melody/hero/events-hero.jpg', // Hero image for melody events
      media: '/images/melody/hero/media-hero.jpg', // Hero image for melody media
      join: '/images/join-hero.jpg', // Tagged as "both"
      contact: '/images/melody/hero/contact-hero.jpg', // Hero image for melody contact
      leadership: '/images/leadership-hero.jpg' // Tagged as "harmony" but used for both currently
    },
    aboutContent: {
      missionStatement: "Parkside Melody is committed to celebrating and advancing the art of treble a cappella singing, creating community through music, and providing educational opportunities for singers of all ages.",
      history: "Parkside Melody was established as the sister chorus to Parkside Harmony, focusing on creating opportunities for treble voices to experience the joy of a cappella singing. We've quickly grown into a vibrant community of singers dedicated to musical excellence.",
      whatWeDo: "Our chorus performs a diverse repertoire spanning various genres including contemporary a cappella, traditional barbershop, and classical pieces. We actively participate in local events, workshops, and competitions, sharing our love for harmony with the community."
    },
    achievements: [
      {
        title: 'Regional Excellence',
        description: 'Recognized for musical excellence in regional competitions.',
      },
      {
        title: 'Educational Outreach',
        description: 'Bringing a cappella education to schools throughout central Pennsylvania.',
      },
      {
        title: 'Performance Innovation',
        description: 'Creating innovative performances that blend tradition with contemporary musical styles.',
      },
    ],
  },
};

export default chorusContent; 