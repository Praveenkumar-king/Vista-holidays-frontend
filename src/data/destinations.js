/**
 * Curated Dataset of Global Travel Destinations
 * Used for Destination Explorer, Search, Filtering, Location Awareness, and Detailed Guides.
 */

export const DESTINATIONS = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    category: 'Culture',
    latitude: 48.8566,
    longitude: 2.3522,
    shortDescription: 'The City of Light renowned for iconic architecture, world-class art museums, and haute cuisine.',
    overview: 'Paris stands as a global epicenter of art, fashion, gastronomy, and culture. From the grand iron lattice of the Eiffel Tower to bohemian streets in Montmartre and riverside boulevards along the Seine, Paris offers an unmatched blend of historic elegance and contemporary vibrancy.',
    tags: ['Eiffel Tower', 'Louvre', 'Romantic', 'Museums', 'Pastries', 'Wine', 'Art', 'Historic'],
    bestTime: 'April - May & Sept - October',
    duration: '4-6 Days',
    estimatedBudget: '$210/day',
    rating: 4.9,
    reviewsCount: 3420,
    featured: true,
    highlights: ['Eiffel Tower & Champ de Mars', 'Louvre Museum & Musée d\'Orsay', 'Cathédrale Notre-Dame', 'Seine River Sunset Cruise'],
    climate: 'Temperate oceanic with warm summers and mild winters',
    currency: 'EUR (€)',
    language: 'French'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    category: 'City',
    latitude: 35.6762,
    longitude: 139.6503,
    shortDescription: 'A dynamic metropolis where ancient shinto shrines meet neon-lit skyscrapers and culinary mastery.',
    overview: 'Tokyo is a sensory marvel seamlessly weaving centuries-old heritage with hyper-modern innovation. Explore historic temples in Asakusa, futuristic shopping districts in Shibuya and Shinjuku, serene royal gardens, and the world\'s most Michelin-starred dining experiences.',
    tags: ['Shibuya', 'Sushi', 'Anime', 'Temples', 'Technology', 'Ramen', 'Futuristic', 'Shopping'],
    bestTime: 'March - May & Sept - November',
    duration: '5-7 Days',
    estimatedBudget: '$185/day',
    rating: 4.9,
    reviewsCount: 4180,
    featured: true,
    highlights: ['Shibuya Crossing & Scramble Square', 'Senso-ji Temple in historic Asakusa', 'Shinjuku Gyoen National Garden', 'Tsukiji Outer Seafood Market'],
    climate: 'Humid subtropical with distinct four seasons',
    currency: 'JPY (¥)',
    language: 'Japanese'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    category: 'Luxury',
    latitude: 25.2048,
    longitude: 55.2708,
    shortDescription: 'An ultra-modern oasis of towering architectural marvels, desert safaris, and luxury waterfronts.',
    overview: 'Dubai represents ambition and grandeur on the Arabian Peninsula. Famous for the soaring Burj Khalifa, palm-shaped artificial archipelagos, lavish shopping destinations, and thrilling desert conservation dunes, Dubai is a beacon of futuristic luxury travel.',
    tags: ['Burj Khalifa', 'Desert Safari', 'Luxury', 'Shopping', 'Beaches', 'Architecture', 'Skyline'],
    bestTime: 'November - March',
    duration: '4-5 Days',
    estimatedBudget: '$275/day',
    rating: 4.8,
    reviewsCount: 2950,
    featured: true,
    highlights: ['Burj Khalifa Observation Deck', 'Dubai Mall & Fountain Spectacle', 'Arabian Desert Dune Bashing', 'Palm Jumeirah & Marina Promenade'],
    climate: 'Desert climate with sunny winters and hot summers',
    currency: 'AED (د.إ)',
    language: 'Arabic, English'
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    category: 'Beach',
    latitude: -8.3405,
    longitude: 115.0920,
    shortDescription: 'The Island of the Gods featuring lush emerald rice terraces, sacred sea temples, and pristine surf breaks.',
    overview: 'Bali is a tropical paradise that captivates travelers with sacred Hindu temples, dramatic volcanic peaks, spiritual yoga sanctuaries in Ubud, vibrant coastal beach clubs in Seminyak, and world-class surfing along the Uluwatu cliffs.',
    tags: ['Beaches', 'Ubud', 'Temples', 'Surfing', 'Waterfalls', 'Yoga', 'Tropical', 'Nature'],
    bestTime: 'April - October (Dry Season)',
    duration: '6-8 Days',
    estimatedBudget: '$110/day',
    rating: 4.8,
    reviewsCount: 3820,
    featured: true,
    highlights: ['Ubud Tegalalang Rice Terraces', 'Uluwatu Cliffside Temple at Sunset', 'Sacred Monkey Forest Sanctuary', 'Nusa Penida Day Trip'],
    climate: 'Tropical warm climate with wet and dry seasons',
    currency: 'IDR (Rp)',
    language: 'Indonesian, Balinese, English'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    category: 'City',
    latitude: 51.5074,
    longitude: -0.1278,
    shortDescription: 'A historic royal capital brimming with regal landmarks, world-class theaters, and leafy royal parks.',
    overview: 'London effortlessly balances two millennia of royal history with modern cultural leadership. Discover the Tower of London, Big Ben, the West End theater district, iconic double-decker bus routes, and expansive green spaces like Hyde Park.',
    tags: ['Big Ben', 'Museums', 'West End', 'Historic', 'Royal', 'Pubs', 'Culture', 'Architecture'],
    bestTime: 'May - September',
    duration: '4-6 Days',
    estimatedBudget: '$225/day',
    rating: 4.8,
    reviewsCount: 3100,
    featured: false,
    highlights: ['British Museum & National Gallery', 'Tower Bridge & Tower of London', 'Westminster Abbey & Big Ben', 'Borough Market Street Food'],
    climate: 'Temperate maritime with mild temperatures throughout the year',
    currency: 'GBP (£)',
    language: 'English'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    category: 'City',
    latitude: 1.3521,
    longitude: 103.8198,
    shortDescription: 'A futuristic garden city known for bioluminescent Supertrees, diverse hawker markets, and lush canopy walks.',
    overview: 'Singapore is a global hub uniting green urban planning with diverse Asian culinary traditions. Marvel at the otherworldly Supertree Grove at Gardens by the Bay, luxury sky pools atop Marina Bay Sands, and authentic hawker center feasts.',
    tags: ['Marina Bay', 'Gardens by the Bay', 'Hawker Food', 'Futuristic', 'Clean', 'Family', 'Shopping'],
    bestTime: 'November - January & June - August',
    duration: '3-4 Days',
    estimatedBudget: '$195/day',
    rating: 4.9,
    reviewsCount: 2680,
    featured: false,
    highlights: ['Gardens by the Bay & Cloud Forest', 'Marina Bay Sands SkyPark Observation', 'Chinatown & Little India Hawker Centres', 'Jewel Changi Indoor Waterfall'],
    climate: 'Tropical rainforest climate with year-round warmth',
    currency: 'SGD (S$)',
    language: 'English, Mandarin, Malay, Tamil'
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    category: 'Culture',
    latitude: 41.9028,
    longitude: 12.4964,
    shortDescription: 'The Eternal City where ancient Roman ruins, Renaissance masterpieces, and bustling piazzas intertwine.',
    overview: 'Rome is an open-air museum filled with monumental history. Stand inside the Colosseum, marvel at the Pantheon\'s oculus, toss a coin into the Trevi Fountain, and savor handmade pasta in candlelit Trastevere alleyways.',
    tags: ['Colosseum', 'Vatican', 'Pasta', 'Historic', 'Ruins', 'Gelato', 'Piazzas', 'Architecture'],
    bestTime: 'April - May & Sept - October',
    duration: '4-5 Days',
    estimatedBudget: '$175/day',
    rating: 4.9,
    reviewsCount: 3600,
    featured: true,
    highlights: ['The Colosseum & Roman Forum', 'Vatican Museums & Sistine Chapel', 'Pantheon & Piazza Navona', 'Trevi Fountain & Spanish Steps'],
    climate: 'Mediterranean climate with hot summers and mild winters',
    currency: 'EUR (€)',
    language: 'Italian'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    category: 'Beach',
    latitude: 41.3879,
    longitude: 2.1699,
    shortDescription: 'A vibrant seaside haven famed for Gaudí architecture, Mediterranean beaches, and tapas culture.',
    overview: 'Barcelona captivates with whimsical modernist creations by Antoni Gaudí, sun-drenched Mediterranean beaches, vibrant Gothic Quarter labyrinths, and lively tapas bars serving fresh seafood along Las Ramblas.',
    tags: ['Sagrada Familia', 'Gaudí', 'Tapas', 'Beach', 'Gothic Quarter', 'Mediterranean', 'Nightlife'],
    bestTime: 'May - June & Sept - October',
    duration: '4-5 Days',
    estimatedBudget: '$165/day',
    rating: 4.8,
    reviewsCount: 2890,
    featured: false,
    highlights: ['La Sagrada Família Basilica', 'Park Güell & Casa Batlló', 'Gothic Quarter (Barri Gòtic)', 'Barceloneta Beach Promenade'],
    climate: 'Mediterranean climate with mild winters and warm summers',
    currency: 'EUR (€)',
    language: 'Spanish, Catalan'
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    region: 'North America',
    category: 'City',
    latitude: 40.7128,
    longitude: -74.0060,
    shortDescription: 'The iconic city that never sleeps, boasting world-famous skylines, Broadway stages, and Central Park.',
    overview: 'New York City is an unstoppable vortex of creative energy. Take in panoramic skyline views from the Empire State Building or SUMMIT One Vanderbilt, walk through Central Park, watch a Broadway show, and explore multicultural culinary pockets across Brooklyn and Manhattan.',
    tags: ['Broadway', 'Central Park', 'Skyline', 'Times Square', 'Museums', 'Food', 'Culture', 'Urban'],
    bestTime: 'April - June & September - November',
    duration: '4-7 Days',
    estimatedBudget: '$290/day',
    rating: 4.8,
    reviewsCount: 3750,
    featured: true,
    highlights: ['Central Park & The Met Museum', 'Empire State Building & High Line', 'Times Square & Broadway District', 'Brooklyn Bridge Walking Trail'],
    climate: 'Humid continental with hot summers and snowy winters',
    currency: 'USD ($)',
    language: 'English'
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    category: 'Food',
    latitude: 13.7563,
    longitude: 100.5018,
    shortDescription: 'A sensory wonderland of ornate golden shrines, buzzing river ferries, and world-famous night street markets.',
    overview: 'Bangkok enthralls with ornate royal palaces, floating markets along the Chao Phraya River, rooftop cocktail lounges with skyline panoramas, and legendary street food stalls dishing up pad thai, mango sticky rice, and spicy tom yum.',
    tags: ['Street Food', 'Temples', 'Night Markets', 'Grand Palace', 'River Cruise', 'Budget Friendly'],
    bestTime: 'November - February',
    duration: '3-5 Days',
    estimatedBudget: '$85/day',
    rating: 4.7,
    reviewsCount: 3120,
    featured: false,
    highlights: ['The Grand Palace & Wat Phra Kaew', 'Wat Arun (Temple of Dawn) by River', 'Chatuchak Weekend Market', 'Chinatown (Yaowarat) Street Food Trail'],
    climate: 'Tropical savanna climate with high year-round temperatures',
    currency: 'THB (฿)',
    language: 'Thai'
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    category: 'Beach',
    latitude: 15.2993,
    longitude: 74.1240,
    shortDescription: 'Sun-kissed Arabian Sea beaches, Portuguese colonial architecture, and laid-back coastal cafes.',
    overview: 'Goa offers a relaxed tropical retreat with golden sand beaches, swaying coconut palms, pastel-painted Portuguese villas in Fontainhas, vibrant beach shack seafood dinners, and scenic spice plantation excursions.',
    tags: ['Beaches', 'Sunsets', 'Portuguese Heritage', 'Seafood', 'Water Sports', 'Nightlife', 'Relaxation'],
    bestTime: 'November - February',
    duration: '3-5 Days',
    estimatedBudget: '$75/day',
    rating: 4.8,
    reviewsCount: 2210,
    featured: true,
    highlights: ['Palolem & Anjuna Beaches', 'Basilica of Bom Jesus (UNESCO Site)', 'Fontainhas Latin Quarter Walk', 'Dudhsagar Waterfalls Day Trek'],
    climate: 'Tropical coastal climate with pleasant winter months',
    currency: 'INR (₹)',
    language: 'Konkani, Hindi, English'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    region: 'Asia',
    category: 'Culture',
    latitude: 26.9124,
    longitude: 75.7873,
    shortDescription: 'The Pink City of Rajasthan featuring majestic hilltop forts, royal palaces, and vibrant handicraft bazaars.',
    overview: 'Jaipur forms India\'s renowned Golden Triangle with its rose-hued terracotta walls, the intricate honeycomb facade of Hawa Mahal, the hilltop Amber Fort overlooking Maota Lake, and kaleidoscopic jewelry and textile bazaars.',
    tags: ['Pink City', 'Forts', 'Palaces', 'Hawa Mahal', 'Royal Heritage', 'Bazaars', 'Handicrafts'],
    bestTime: 'October - March',
    duration: '3-4 Days',
    estimatedBudget: '$70/day',
    rating: 4.9,
    reviewsCount: 2450,
    featured: false,
    highlights: ['Amber Fort & Sheesh Mahal (Mirror Palace)', 'Hawa Mahal (Palace of Winds)', 'City Palace & Jantar Mantar Observatory', 'Johari & Bapu Bazaars for Gemstones'],
    climate: 'Semi-arid with hot summers and comfortable winters',
    currency: 'INR (₹)',
    language: 'Hindi, Rajasthani, English'
  },
  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    region: 'Asia',
    category: 'Adventure',
    latitude: 32.2396,
    longitude: 77.1887,
    shortDescription: 'A high-altitude Himalayan valley retreat surrounded by snow-capped peaks, pine forests, and adventure trails.',
    overview: 'Nestled in Himachal Pradesh along the Beas River, Manali is a gateway to Himalayan grandeur. Experience paragliding in Solang Valley, snow adventures near Rohtang Pass, cedar-scented trails through Old Manali, and serene hot springs.',
    tags: ['Himalayas', 'Snow', 'Paragliding', 'Trekking', 'Mountains', 'Solang Valley', 'Scenic'],
    bestTime: 'October - February (Snow) & March - June (Pleasant)',
    duration: '4-5 Days',
    estimatedBudget: '$65/day',
    rating: 4.8,
    reviewsCount: 1980,
    featured: true,
    highlights: ['Solang Valley Adventure Sports', 'Atal Tunnel & Rohtang Pass Viewpoint', 'Hadimba Devi Ancient Cedar Temple', 'Old Manali Bohemian Cafes & River Walk'],
    climate: 'Subtropical highland climate with cold snowy winters',
    currency: 'INR (₹)',
    language: 'Hindi, Pahari, English'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    region: 'Asia',
    category: 'Culture',
    latitude: 13.0827,
    longitude: 80.2707,
    shortDescription: 'The cultural capital of South India celebrated for Dravidian temple spires, classical music, and Marina Beach.',
    overview: 'Chennai is the cultural anchor of Tamil Nadu, celebrated for its towering Dravidian gopurams at Kapaleeshwarar Temple, the vast golden sands of Marina Beach, authentic filter coffee culture, and thriving classical arts and silk weaving heritage.',
    tags: ['Marina Beach', 'Dravidian Temples', 'Carnatic Music', 'Filter Coffee', 'Silk Sarees', 'South Indian Food'],
    bestTime: 'November - February',
    duration: '2-4 Days',
    estimatedBudget: '$60/day',
    rating: 4.7,
    reviewsCount: 1740,
    featured: false,
    highlights: ['Kapaleeshwarar Ancient Temple in Mylapore', 'Marina Beach Sunset Promenade', 'San Thome Basilica & Fort St. George', 'DakshinaChitra Living Heritage Museum'],
    climate: 'Tropical wet and dry with warm coastal breezes',
    currency: 'INR (₹)',
    language: 'Tamil, English'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    category: 'City',
    latitude: 19.0760,
    longitude: 72.8777,
    shortDescription: 'The City of Dreams boasting colonial grand arches, Bollywood studios, and the Arabian Sea promenade.',
    overview: 'Mumbai pulses with unstoppable energy as India\'s financial and cinematic hub. Gaze at the Gateway of India overlooking the harbor, take an evening stroll along Marine Drive\'s Queen\'s Necklace, and relish Mumbai street food like vada pav and pav bhaji.',
    tags: ['Marine Drive', 'Gateway of India', 'Bollywood', 'Street Food', 'Colonial Architecture', 'Coastline'],
    bestTime: 'November - February',
    duration: '3-5 Days',
    estimatedBudget: '$80/day',
    rating: 4.8,
    reviewsCount: 2890,
    featured: false,
    highlights: ['Gateway of India & Elephanta Caves Ferry', 'Marine Drive (Queen\'s Necklace) Sunset Walk', 'Chhatrapati Shivaji Maharaj Terminus (UNESCO)', 'Colaba Causeway & Bandra Art Precinct'],
    climate: 'Tropical wet and dry with maritime moderation',
    currency: 'INR (₹)',
    language: 'Marathi, Hindi, English'
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    category: 'Beach',
    latitude: 36.3932,
    longitude: 25.4615,
    shortDescription: 'Picturesque volcanic island with whitewashed cliffside dwellings, blue-domed churches, and caldera sunsets.',
    overview: 'Santorini is the crown jewel of the Greek Cyclades, rising dramatically from the submerged volcanic caldera. Wander through cliffside labyrinthine paths in Oia, relax on red and black volcanic beaches, and savor Assyrtiko wine during glowing Aegean sunsets.',
    tags: ['Caldera', 'Oia', 'Sunsets', 'Blue Domes', 'Aegean Sea', 'Wine', 'Romantic', 'Islands'],
    bestTime: 'May - October',
    duration: '3-5 Days',
    estimatedBudget: '$230/day',
    rating: 4.9,
    reviewsCount: 3150,
    featured: true,
    highlights: ['Oia Sunset Castle & Blue-Domed Churches', 'Fira to Oia Cliffside Hiking Trail', 'Red Beach & Akrotiri Prehistoric Ruins', 'Catamaran Caldera Cruise with Hot Springs'],
    climate: 'Mediterranean semi-arid with sunny dry summers',
    currency: 'EUR (€)',
    language: 'Greek, English'
  },
  {
    id: 'zermatt',
    name: 'Zermatt',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Adventure',
    latitude: 45.9763,
    longitude: 7.7491,
    shortDescription: 'A pristine car-free alpine village crowned by the majestic pyramid peak of the Matterhorn.',
    overview: 'Zermatt is an alpine dream nestled in the Swiss Alps beneath the iconic Matterhorn. Known for world-class skiing, scenic cogwheel trains to Gornergrat, crystal-clear glacial lakes, and traditional Swiss cheese fondue chalets.',
    tags: ['Matterhorn', 'Skiing', 'Swiss Alps', 'Hiking', 'Gornergrat', 'Snow', 'Luxury Chalets'],
    bestTime: 'Dec - April (Skiing) & June - Sept (Hiking)',
    duration: '3-5 Days',
    estimatedBudget: '$320/day',
    rating: 4.9,
    reviewsCount: 1620,
    featured: true,
    highlights: ['Gornergrat Scenic Cogwheel Railway', 'Matterhorn Glacier Paradise Cable Car', 'Five Lakes Alpine Walk (5-Seenweg)', 'Traditional Swiss Chalet Fondue Dining'],
    climate: 'Alpine climate with crisp mountain air year-round',
    currency: 'CHF (CHF)',
    language: 'German, French, English'
  },
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    category: 'Beach',
    latitude: 40.6340,
    longitude: 14.6027,
    shortDescription: 'A breathtaking 50-kilometer coastline of vertical pastel villages, lemon groves, and azure waters.',
    overview: 'The Amalfi Coast is one of the world\'s most romantic coastal drives. Marvel at pastel houses tumbling down Positano\'s cliffs, visit the historic seaside cathedral in Amalfi town, and gaze out from Ravello\'s cliffside gardens overlooking the Tyrrhenian Sea.',
    tags: ['Positano', 'Cliffside', 'Mediterranean', 'Lemon Groves', 'Scenic Drive', 'Boating', 'Romantic'],
    bestTime: 'May - September',
    duration: '4-6 Days',
    estimatedBudget: '$260/day',
    rating: 4.8,
    reviewsCount: 2100,
    featured: false,
    highlights: ['Positano Beach & Cliffside Alleys', 'Villa Rufolo & Cimbrone Gardens in Ravello', 'Path of the Gods (Sentiero degli Dei) Trek', 'Capri Island Private Boat Excursion'],
    climate: 'Mediterranean climate with warm dry summers and mild winters',
    currency: 'EUR (€)',
    language: 'Italian'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    category: 'Beach',
    latitude: -33.8688,
    longitude: 151.2093,
    shortDescription: 'A sun-drenched coastal capital iconic for its Opera House sails, Harbour Bridge, and Bondi surf.',
    overview: 'Sydney wraps cosmopolitan sophistication around one of the globe\'s most stunning natural harbors. Catch world-class performances at the Sydney Opera House, climb the Sydney Harbour Bridge, and walk the coastal cliff path from Bondi to Coogee.',
    tags: ['Opera House', 'Bondi Beach', 'Harbour Bridge', 'Surfing', 'Coastal Walk', 'Seafood', 'Oceania'],
    bestTime: 'September - November & March - May',
    duration: '4-6 Days',
    estimatedBudget: '$210/day',
    rating: 4.8,
    reviewsCount: 2340,
    featured: false,
    highlights: ['Sydney Opera House & Royal Botanic Garden', 'Sydney Harbour Bridge Climb or Walk', 'Bondi to Coogee Spectacular Coastal Trail', 'Manly Ferry Ride with Harbor Vistas'],
    climate: 'Sunny temperate climate with warm summers and mild winters',
    currency: 'AUD (A$)',
    language: 'English'
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    category: 'Nature',
    latitude: -33.9249,
    longitude: 18.4241,
    shortDescription: 'Where flat-topped Table Mountain meets two oceans, penguin colonies, and rolling Winelands.',
    overview: 'Cape Town is blessed with extraordinary natural drama. Ascend Table Mountain by cable car, meet African penguins at Boulders Beach, journey to the Cape of Good Hope, and tour historic wine estates in Stellenbosch and Franschhoek.',
    tags: ['Table Mountain', 'Penguins', 'Cape of Good Hope', 'Wine Tasting', 'Beaches', 'Hiking', 'Safari'],
    bestTime: 'November - April',
    duration: '5-7 Days',
    estimatedBudget: '$120/day',
    rating: 4.9,
    reviewsCount: 1940,
    featured: false,
    highlights: ['Table Mountain Aerial Cableway & Summit Trek', 'Boulders Beach African Penguin Colony', 'Cape Point & Cape of Good Hope Nature Reserve', 'V&A Waterfront & Kirstenbosch Botanical Gardens'],
    climate: 'Mediterranean climate with warm dry summers and mild wet winters',
    currency: 'ZAR (R)',
    language: 'English, Afrikaans, Xhosa'
  }
];

/**
 * Filter and Search Utility for Destinations
 */
export function filterDestinations(destinations = DESTINATIONS, {
  search = '',
  region = 'all',
  category = 'all',
  sortBy = 'featured'
} = {}) {
  const normalizedSearch = search.trim().toLowerCase();

  return destinations
    .filter((dest) => {
      // 1. Search Query Filter
      if (normalizedSearch) {
        const nameMatch = dest.name?.toLowerCase().includes(normalizedSearch);
        const countryMatch = dest.country?.toLowerCase().includes(normalizedSearch);
        const regionMatch = dest.region?.toLowerCase().includes(normalizedSearch);
        const descMatch = dest.shortDescription?.toLowerCase().includes(normalizedSearch);
        const tagsMatch = dest.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearch));

        if (!nameMatch && !countryMatch && !regionMatch && !descMatch && !tagsMatch) {
          return false;
        }
      }

      // 2. Region Filter
      if (region && region !== 'all') {
        if (dest.region?.toLowerCase() !== region.toLowerCase()) {
          return false;
        }
      }

      // 3. Category Filter
      if (category && category !== 'all') {
        if (dest.category?.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // 4. Sort Filter
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      if (sortBy === 'price-low') {
        const getPrice = (d) => parseInt((d.estimatedBudget || '').replace(/[^0-9]/g, '') || 0, 10);
        return getPrice(a) - getPrice(b);
      }
      if (sortBy === 'price-high') {
        const getPrice = (d) => parseInt((d.estimatedBudget || '').replace(/[^0-9]/g, '') || 0, 10);
        return getPrice(b) - getPrice(a);
      }
      // Default: featured first, then highest rating
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return (b.rating || 0) - (a.rating || 0);
    });
}

/**
 * Get distinct regions from dataset
 */
export function getDistinctRegions(destinations = DESTINATIONS) {
  const regions = new Set(destinations.map((d) => d.region).filter(Boolean));
  return Array.from(regions).sort();
}

/**
 * Get distinct categories from dataset
 */
export function getDistinctCategories(destinations = DESTINATIONS) {
  const categories = new Set(destinations.map((d) => d.category).filter(Boolean));
  return Array.from(categories).sort();
}

/**
 * Retrieve a destination by its slug/ID
 */
export function getDestinationById(id, destinations = DESTINATIONS) {
  if (!id) return null;
  return destinations.find((d) => d.id.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Retrieve all featured destinations
 */
export function getFeaturedDestinations(destinations = DESTINATIONS) {
  return destinations.filter((d) => d.featured);
}

export default DESTINATIONS;
