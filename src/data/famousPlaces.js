/**
 * Curated Dataset of Famous Places and Landmarks
 * Associated with destinations across the world.
 */

export const FAMOUS_PLACES = [
  // ==========================================
  // PARIS, FRANCE
  // ==========================================
  {
    id: 'eiffel-tower',
    destinationId: 'paris',
    name: 'Eiffel Tower',
    category: 'Historic Landmark',
    location: 'Champ de Mars, 7th Arrondissement, Paris',
    shortDescription: 'The globally iconic 330-meter iron lattice tower offering panoramic vistas over the Parisian skyline.',
    overview: 'Engineered by Gustave Eiffel for the 1889 Exposition Universelle, the Eiffel Tower remains the defining symbol of Paris. Visitors can ascend to multiple observation decks, dine at Le Jules Verne, or watch the magnificent 20,000-bulb light sparkle every evening.',
    estimatedVisitTime: '2-3 Hours',
    featured: true,
    highlights: ['Summit Observation Terrace', 'Glass Floor at Level 1', 'Nightly Golden Hour Sparkle'],
    bestTimeToVisit: 'Early morning or 1 hour before sunset'
  },
  {
    id: 'louvre-museum',
    destinationId: 'paris',
    name: 'Louvre Museum',
    category: 'Art & History Museum',
    location: 'Rue de Rivoli, 1st Arrondissement, Paris',
    shortDescription: 'The world’s largest art museum, home to the Mona Lisa and the iconic I.M. Pei glass pyramid.',
    overview: 'Housed within the historic Louvre Palace, this museum spans over 70,000 square meters showcasing more than 38,000 masterworks including Leonardo da Vinci\'s Mona Lisa, the Venus de Milo, and the Winged Victory of Samothrace.',
    estimatedVisitTime: '3-4 Hours',
    featured: true,
    highlights: ['The Mona Lisa Gallery', 'Venus de Milo Classical Sculpture', 'I.M. Pei Glass Pyramid Courtyard'],
    bestTimeToVisit: 'Wednesday or Friday evening for fewer crowds'
  },
  {
    id: 'notre-dame-paris',
    destinationId: 'paris',
    name: 'Notre-Dame Cathedral',
    category: 'Historic Cathedral',
    location: 'Île de la Cité, 4th Arrondissement, Paris',
    shortDescription: 'A masterpiece of French Gothic architecture with towering spires and historic stained-glass rose windows.',
    overview: 'Rising from the Île de la Cité on the River Seine, Notre-Dame is celebrated for its flying buttresses, gargoyles, and monumental medieval bells immortalized in Victor Hugo\'s literary classic.',
    estimatedVisitTime: '1-2 Hours',
    featured: false,
    highlights: ['West Rose Stained-Glass Window', 'Gothic Flying Buttresses', 'Historic Île de la Cité Surroundings'],
    bestTimeToVisit: 'Morning for soft sunlight through stained glass'
  },
  {
    id: 'arc-de-triomphe',
    destinationId: 'paris',
    name: 'Arc de Triomphe & Champs-Élysées',
    category: 'Monument & Avenue',
    location: 'Place Charles de Gaulle, 8th Arrondissement, Paris',
    shortDescription: 'Triumphal arch honoring French military history, crowning the world-famous Avenue des Champs-Élysées.',
    overview: 'Commissioned by Napoleon in 1806, the Arc de Triomphe stands proudly at the center of the Étoile roundabout. An ascent to its rooftop terrace delivers one of Paris\'s finest 360-degree vantage points over twelve radiating boulevards.',
    estimatedVisitTime: '1-2 Hours',
    featured: false,
    highlights: ['Panoramic Rooftop Overlook', 'Tomb of the Unknown Soldier', 'Stroll along Champs-Élysées'],
    bestTimeToVisit: 'Dusk as the city avenue lights turn on'
  },

  // ==========================================
  // TOKYO, JAPAN
  // ==========================================
  {
    id: 'shibuya-crossing',
    destinationId: 'tokyo',
    name: 'Shibuya Crossing & Scramble Square',
    category: 'Urban Landmark',
    location: 'Shibuya City, Tokyo',
    shortDescription: 'The world\'s busiest pedestrian intersection illuminated by gigantic neon screens and bustling energy.',
    overview: 'At Shibuya Crossing, up to 3,000 pedestrians cross simultaneously at every green light. Towering overhead is SHIBUYA SKY, an open-air rooftop observation deck providing breathtaking views over Tokyo and Mount Fuji on clear days.',
    estimatedVisitTime: '1-2 Hours',
    featured: true,
    highlights: ['SHIBUYA SKY Rooftop Deck', 'Hachiko Loyal Dog Statue', 'Neon-lit night scramble view'],
    bestTimeToVisit: 'Sunset into early nightfall'
  },
  {
    id: 'senso-ji-temple',
    destinationId: 'tokyo',
    name: 'Senso-ji Ancient Temple',
    category: 'Historic Shrine',
    location: 'Asakusa, Taito City, Tokyo',
    shortDescription: 'Tokyo’s oldest Buddhist temple featuring the monumental Kaminarimon Thunder Gate and Nakamise market.',
    overview: 'Founded in 645 AD, Senso-ji is dedicated to Kannon Bodhisattva. Visitors enter under the enormous red paper lantern of Kaminarimon Gate and walk down Nakamise Dori, a centuries-old shopping street serving traditional Japanese sweets and souvenirs.',
    estimatedVisitTime: '2-3 Hours',
    featured: true,
    highlights: ['Kaminarimon Giant Red Lantern', 'Five-Story Pagoda', 'Nakamise Shopping Street Sweets'],
    bestTimeToVisit: 'Early morning before 9:00 AM'
  },
  {
    id: 'tokyo-skytree',
    destinationId: 'tokyo',
    name: 'Tokyo Skytree',
    category: 'Observation Tower',
    location: 'Sumida City, Tokyo',
    shortDescription: 'A 634-meter broadcasting and observation tower offering unparalleled bird\'s-eye vistas of the Kanto Plain.',
    overview: 'As the tallest structure in Japan and the third-tallest building globally, Tokyo Skytree provides glass-floored viewing decks at 350m and 450m, along with high-tech planetariums and an extensive shopping complex.',
    estimatedVisitTime: '2 Hours',
    featured: false,
    highlights: ['Tembo Deck & Tembo Galleria', 'Glass Floor Observation', 'Tokyo Solamachi Mega Mall'],
    bestTimeToVisit: 'Clear afternoons for Mount Fuji silhouettes'
  },
  {
    id: 'meiji-shrine',
    destinationId: 'tokyo',
    name: 'Meiji Jingu Shrine',
    category: 'Shinto Sanctuary',
    location: 'Shibuya City (near Harajuku), Tokyo',
    shortDescription: 'A serene Shinto shrine enveloped in a dense 170-acre sacred forest in the heart of metropolitan Tokyo.',
    overview: 'Dedicated to the deified spirits of Emperor Meiji and Empress Shoken, Meiji Jingu offers an immediate peaceful respite from Tokyo\'s bustling streets, featuring towering wooden torii gates and picturesque sake barrel offerings.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: false,
    highlights: ['Towering Cypress Torii Gates', 'Decorative Consecrated Sake Barrels', 'Serene Sacred Forest Trails'],
    bestTimeToVisit: 'Morning for peaceful contemplation'
  },

  // ==========================================
  // DUBAI, UAE
  // ==========================================
  {
    id: 'burj-khalifa',
    destinationId: 'dubai',
    name: 'Burj Khalifa',
    category: 'Architectural Marvel',
    location: 'Downtown Dubai, UAE',
    shortDescription: 'The world\'s tallest architectural marvel soaring 828 meters into the Arabian sky.',
    overview: 'A triumph of modern engineering, the Burj Khalifa offers high-speed elevators taking guests to observation decks on levels 124, 125, and 148, presenting sweeping views across the Dubai skyline, Arabian Gulf, and desert expanse.',
    estimatedVisitTime: '2-3 Hours',
    featured: true,
    highlights: ['At the Top Sky Observation Deck', 'Dubai Fountain Synchronization', 'Futuristic VR & Light Displays'],
    bestTimeToVisit: 'Late afternoon to catch sunset and night lights'
  },
  {
    id: 'palm-jumeirah',
    destinationId: 'dubai',
    name: 'Palm Jumeirah & Atlantis',
    category: 'Island & Resort Landmark',
    location: 'Palm Jumeirah, Dubai',
    shortDescription: 'World-famous palm-shaped artificial archipelago hosting luxury beachfront resorts and aquariums.',
    overview: 'An engineering wonder visible from space, Palm Jumeirah features luxury seaside villas, The View at The Palm observation tower, Aquaventure Waterpark, and The Lost Chambers Aquarium at Atlantis The Palm.',
    estimatedVisitTime: '3-4 Hours',
    featured: false,
    highlights: ['The View at The Palm (360° Overlook)', 'The Lost Chambers Aquarium', 'The Pointe Waterfront Boardwalk'],
    bestTimeToVisit: 'Afternoon to evening'
  },
  {
    id: 'dubai-frame',
    destinationId: 'dubai',
    name: 'Dubai Frame',
    category: 'Cultural Landmark',
    location: 'Zabeel Park, Dubai',
    shortDescription: 'A colossal 150-meter golden picture frame framing Old Dubai to the north and New Dubai to the south.',
    overview: 'Positioned to showcase Dubai\'s historic past from one side and its hyper-modern skyline from the other, the Dubai Frame features a 93-meter glass bridge that turns transparent beneath your feet as you walk across.',
    estimatedVisitTime: '1.5 Hours',
    featured: false,
    highlights: ['Walk-on Luminous Glass Bridge', 'Old Dubai & Future Dubai Museums', 'Panoramic Skyline Comparisons'],
    bestTimeToVisit: 'Morning or golden hour'
  },

  // ==========================================
  // BALI, INDONESIA
  // ==========================================
  {
    id: 'tegalalang-rice-terraces',
    destinationId: 'bali',
    name: 'Tegalalang Rice Terraces',
    category: 'Cultural Landscape',
    location: 'Ubud, Gianyar Regency, Bali',
    shortDescription: 'Cascading emerald-green rice paddies sculpted into lush ravines using ancient subak irrigation.',
    overview: 'Tegalalang offers postcard-perfect views of sculpted green terraces. Visitors can hike through the paddy paths, experience thrilling jungle swings suspended over the valley, and sample authentic Balinese luwak coffee.',
    estimatedVisitTime: '2-3 Hours',
    featured: true,
    highlights: ['Ancient Subak UNESCO Irrigation System', 'Bali Jungle Swings', 'Cliffside Organic Tea & Coffee Cafes'],
    bestTimeToVisit: 'Sunrise between 6:30 AM - 8:00 AM'
  },
  {
    id: 'uluwatu-temple',
    destinationId: 'bali',
    name: 'Uluwatu Cliffside Sea Temple',
    category: 'Scenic Sanctuary',
    location: 'Pecatu, South Kuta, Bali',
    shortDescription: 'A dramatic 70-meter clifftop temple perched above the crashing waves of the Indian Ocean.',
    overview: 'Pura Luhur Uluwatu is one of Bali\'s six key spiritual pillars. Built on the edge of a steep oceanic cliff, it is renowned for hypnotic nightly Kecak fire dance performances staged against golden Indian Ocean sunsets.',
    estimatedVisitTime: '2-3 Hours',
    featured: true,
    highlights: ['Nightly Kecak Fire Dance Performance', 'Panoramic Clifftop Ocean Vistas', 'Resident Monkey Forest Troop'],
    bestTimeToVisit: '5:00 PM for the sunset performance'
  },
  {
    id: 'sacred-monkey-forest',
    destinationId: 'bali',
    name: 'Sacred Monkey Forest Sanctuary',
    category: 'Nature Reserve',
    location: 'Padangtegal, Ubud, Bali',
    shortDescription: 'A lush jungle sanctuary housing over 1,000 Balinese long-tailed macaques and ancient mossy temples.',
    overview: 'Spanning 27 acres of pristine jungle, this sanctuary preserves sacred 14th-century temples, ancient banyan trees, and cascading river ravines, providing intimate encounters with playful monkey families.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: false,
    highlights: ['Over 1,000 Free-Roaming Macaques', 'Ancient Dragon Bridge & Banyan Roots', 'Pura Dalem Agung Padangtegal Temple'],
    bestTimeToVisit: 'Early morning to avoid afternoon heat'
  },

  // ==========================================
  // LONDON, UNITED KINGDOM
  // ==========================================
  {
    id: 'big-ben',
    destinationId: 'london',
    name: 'Big Ben & Palace of Westminster',
    category: 'Historic Landmark',
    location: 'Westminster, London',
    shortDescription: 'The neo-Gothic clock tower and British Houses of Parliament along the River Thames.',
    overview: 'Standing tall at the north end of the Houses of Parliament, the Elizabeth Tower (housing the famed Big Ben bell) has tolled the hour since 1859. The architectural majesty of Westminster stands as a cornerstone of British democracy.',
    estimatedVisitTime: '1-2 Hours',
    featured: true,
    highlights: ['Elizabeth Tower Clock Face', 'Westminster Bridge Viewpoint', 'Historic Houses of Parliament Architecture'],
    bestTimeToVisit: 'Late morning followed by a Thames walk'
  },
  {
    id: 'tower-bridge',
    destinationId: 'london',
    name: 'Tower Bridge',
    category: 'Architectural Marvel',
    location: 'Tower Bridge Rd, London',
    shortDescription: 'Iconic Victorian bascule and suspension bridge spanning the River Thames near the Tower of London.',
    overview: 'Completed in 1894, Tower Bridge features high-level glass floor walkways providing breathtaking looks down at river traffic, combined with Victorian engine rooms preserving historic steam hydraulics.',
    estimatedVisitTime: '1.5 Hours',
    featured: false,
    highlights: ['High-Level Glass Floor Walkway', 'Victorian Steam Engine Rooms', 'River Thames Panoramic Overlook'],
    bestTimeToVisit: 'Midday or sunset'
  },
  {
    id: 'british-museum',
    destinationId: 'london',
    name: 'The British Museum',
    category: 'World Heritage Museum',
    location: 'Great Russell St, Bloomsbury, London',
    shortDescription: 'World-renowned museum dedicated to human history, art, and culture under a magnificent glass dome.',
    overview: 'Covering millions of works from all continents, the British Museum preserves key world treasures including the Rosetta Stone, Parthenon Sculptures, and Egyptian mummies beneath the striking Norman Foster Great Court.',
    estimatedVisitTime: '3 Hours',
    featured: false,
    highlights: ['The Rosetta Stone', 'Great Court Glass Canopy Roof', 'Ancient Egyptian Mummy Galleries'],
    bestTimeToVisit: 'Weekday mornings'
  },

  // ==========================================
  // SINGAPORE
  // ==========================================
  {
    id: 'gardens-by-the-bay',
    destinationId: 'singapore',
    name: 'Gardens by the Bay & Supertrees',
    category: 'Futuristic Botanical Park',
    location: 'Marina Gardens Dr, Singapore',
    shortDescription: 'Bioluminescent vertical Supertree structures and the world\'s largest glass greenhouse.',
    overview: 'A 250-acre nature sanctuary on reclaimed land, featuring 18 Supertrees rising up to 50 meters, the misty indoor waterfall of the Cloud Forest Dome, and the nightly Garden Rhapsody light and sound spectacle.',
    estimatedVisitTime: '3 Hours',
    featured: true,
    highlights: ['35-Meter Indoor Waterfall in Cloud Forest', 'OCBC Skyway Supertree Aerial Walk', 'Nightly Garden Rhapsody Light Show'],
    bestTimeToVisit: 'Late afternoon to catch daylight domes and evening light shows'
  },
  {
    id: 'marina-bay-sands-skypark',
    destinationId: 'singapore',
    name: 'Marina Bay Sands SkyPark',
    category: 'Observation Deck',
    location: '10 Bayfront Ave, Singapore',
    shortDescription: 'A cantilevered observation deck suspended 200 meters above Marina Bay.',
    overview: 'Perched atop the three hotel towers of Marina Bay Sands, the SkyPark offers 360-degree vistas of the Singapore Strait, the city skyline, and Gardens by the Bay.',
    estimatedVisitTime: '1.5 Hours',
    featured: false,
    highlights: ['360° Panoramic Sky Deck', 'Overlook of Supertree Light Show', 'Spectacular Sunset Cityline View'],
    bestTimeToVisit: '6:30 PM for sunset into twilight'
  },
  {
    id: 'jewel-changi',
    destinationId: 'singapore',
    name: 'Jewel Changi Rain Vortex',
    category: 'Architectural Wonder',
    location: 'Airport Blvd, Changi, Singapore',
    shortDescription: 'The world\'s tallest indoor waterfall cascading 40 meters through a multi-tier indoor forest canopy.',
    overview: 'Surrounded by four stories of terraced indoor rainforest gardens, the HSBC Rain Vortex recirculates collected rainwater beneath a striking glass dome, creating a spellbinding spectacle.',
    estimatedVisitTime: '1.5 Hours',
    featured: false,
    highlights: ['40-Meter Indoor Waterfall', 'Shiseido Forest Valley Terraced Trails', 'Canopy Park Glass Bridge Walk'],
    bestTimeToVisit: 'Evening for the hourly light and music show'
  },

  // ==========================================
  // ROME, ITALY
  // ==========================================
  {
    id: 'colosseum-rome',
    destinationId: 'rome',
    name: 'The Colosseum & Roman Forum',
    category: 'Ancient Ruins',
    location: 'Piazza del Colosseo, Rome',
    shortDescription: 'The monumental 2,000-year-old stone amphitheatre that hosted gladiatorial spectacles in ancient Rome.',
    overview: 'The largest amphitheatre ever built in the ancient world, the Colosseum could hold over 50,000 spectators. Walking through its subterranean hypogeum and adjacent Roman Forum ruins offers an awe-inspiring journey through classical antiquity.',
    estimatedVisitTime: '3 Hours',
    featured: true,
    highlights: ['Colosseum Arena Floor & Underground Hypogeum', 'Roman Forum Ancient Temples & Arches', 'Palatine Hill Emperors\' Residences'],
    bestTimeToVisit: 'First entry in the morning at 8:30 AM'
  },
  {
    id: 'trevi-fountain',
    destinationId: 'rome',
    name: 'Trevi Fountain',
    category: 'Baroque Monument',
    location: 'Piazza di Trevi, Rome',
    shortDescription: 'Rome’s grandest Baroque fountain where legend promises a return to Rome for every coin tossed.',
    overview: 'Designed by Nicola Salvi in 1762, this Baroque masterpiece stands 26 meters high, showcasing the god Oceanus on his chariot surrounded by sea horses and cascades of crystal-clear spring water.',
    estimatedVisitTime: '45 Minutes',
    featured: false,
    highlights: ['Oceanus Central Marble Sculpture', 'Traditional Coin Tossing Ritual', 'Nightly Illumination over Cascades'],
    bestTimeToVisit: 'Late night or early sunrise to enjoy without crowds'
  },
  {
    id: 'vatican-city',
    destinationId: 'rome',
    name: 'Vatican Museums & Sistine Chapel',
    category: 'Religious & Art Sanctuary',
    location: 'Vatican City, Rome',
    shortDescription: 'Papal palaces containing Michelangelo\'s Sistine Chapel ceiling and St. Peter\'s Basilica.',
    overview: 'The world\'s smallest independent state preserves supreme Renaissance art treasures. Gaze up at Michelangelo\'s ceiling frescoes in the Sistine Chapel, walk through the Raphael Rooms, and stand beneath St. Peter\'s immense dome.',
    estimatedVisitTime: '3-4 Hours',
    featured: false,
    highlights: ['Michelangelo\'s Sistine Chapel Frescoes', 'Raphael Rooms Masterpieces', 'St. Peter\'s Basilica & Square'],
    bestTimeToVisit: 'Early morning with pre-booked timed tickets'
  },

  // ==========================================
  // BARCELONA, SPAIN
  // ==========================================
  {
    id: 'sagrada-familia',
    destinationId: 'barcelona',
    name: 'La Sagrada Família',
    category: 'Architectural Wonder',
    location: 'Eixample District, Barcelona',
    shortDescription: 'Antoni Gaudí\'s visionary basilica with organic forest-like stone columns and kaleidoscopic stained glass.',
    overview: 'Under construction since 1882, this UNESCO World Heritage basilica is an unparalleled triumph of modernist architecture. Inside, sunlight filters through vibrant stained-glass windows creating an ethereal cathedral canopy.',
    estimatedVisitTime: '2 Hours',
    featured: true,
    highlights: ['Nativity & Passion Facades', 'Interior Tree-Branch Pillars', 'Tower Ascent for City Panoramas'],
    bestTimeToVisit: 'Mid-afternoon when sunlight streams through stained glass'
  },
  {
    id: 'park-guell',
    destinationId: 'barcelona',
    name: 'Park Güell',
    category: 'Modernist Garden',
    location: 'Gràcia District, Barcelona',
    shortDescription: 'Whimsical public park featuring colorful mosaic salamanders, curved benches, and Mediterranean views.',
    overview: 'Commissioned by Eusebi Güell and designed by Gaudí, Park Güell integrates fantastical stone viaducts, gingerbread-style gatehouses, and the famous trencadís mosaic terrace overlooking Barcelona to the sea.',
    estimatedVisitTime: '2 Hours',
    featured: false,
    highlights: ['Mosaic Salamander (El Drac)', 'Hypostyle Room with 86 Stone Columns', 'Serpentine Mosaic Bench Terrace'],
    bestTimeToVisit: 'Morning or late afternoon'
  },
  {
    id: 'gothic-quarter',
    destinationId: 'barcelona',
    name: 'Gothic Quarter (Barri Gòtic)',
    category: 'Historic District',
    location: 'Ciutat Vella, Barcelona',
    shortDescription: 'A labyrinth of narrow medieval stone alleys, Roman walls, and vibrant tapas plazas.',
    overview: 'The oldest core of Barcelona, the Gothic Quarter features peaceful courtyards, the Cathedral of the Holy Cross and Saint Eulalia, artisan workshops, and bustling evening plazas like Plaça Reial.',
    estimatedVisitTime: '2 Hours',
    featured: false,
    highlights: ['Barcelona Gothic Cathedral & Cloister', 'Plaça del Rei Medieval Square', 'Historic Pont del Bisbe Marble Bridge'],
    bestTimeToVisit: 'Late afternoon into tapas hour'
  },

  // ==========================================
  // NEW YORK, UNITED STATES
  // ==========================================
  {
    id: 'central-park',
    destinationId: 'new-york',
    name: 'Central Park',
    category: 'Iconic Urban Park',
    location: 'Manhattan, New York City',
    shortDescription: 'An 843-acre lush urban oasis of lakes, walking paths, and historic bridges surrounded by skyscrapers.',
    overview: 'Designed by Frederick Law Olmsted and Calvert Vaux, Central Park is the green lung of Manhattan. Highlights include Bethesda Terrace and Fountain, Bow Bridge, Sheep Meadow, and scenic boat rentals on The Lake.',
    estimatedVisitTime: '2-4 Hours',
    featured: true,
    highlights: ['Bethesda Terrace & Angel of Waters Fountain', 'Bow Bridge Romantic Overlook', 'The Mall & Literary Walk Elm Canopy'],
    bestTimeToVisit: 'Morning to early afternoon'
  },
  {
    id: 'empire-state-building',
    destinationId: 'new-york',
    name: 'Empire State Building',
    category: 'Skyscraper Landmark',
    location: '350 5th Ave, Manhattan, New York',
    shortDescription: 'The world\'s most famous Art Deco skyscraper towering 102 stories above Midtown Manhattan.',
    overview: 'Completed in 1931, the Empire State Building features open-air 86th-floor and enclosed 102nd-floor observatories delivering iconic skyline views stretching up to 80 miles across six states on clear days.',
    estimatedVisitTime: '2 Hours',
    featured: false,
    highlights: ['86th Floor Open-Air Observatory', 'Art Deco Restored Marble Lobby', 'Interactive History Exhibits on 2nd Floor'],
    bestTimeToVisit: 'Sunset or late evening'
  },
  {
    id: 'brooklyn-bridge',
    destinationId: 'new-york',
    name: 'Brooklyn Bridge & DUMBO',
    category: 'Historic Suspension Bridge',
    location: 'Manhattan to Brooklyn, New York',
    shortDescription: 'A pioneering 1883 neo-Gothic stone suspension bridge connecting Manhattan to scenic DUMBO waterfront.',
    overview: 'Walking across the elevated timber boardwalk of the Brooklyn Bridge is an essential New York experience, offering unmatched views of the Manhattan skyline, New York Harbor, and Jane\'s Carousel in Brooklyn Bridge Park.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: false,
    highlights: ['Neo-Gothic Stone Arch Towers', 'Elevated Pedestrian Boardwalk', 'DUMBO Washington Street Photo Spot'],
    bestTimeToVisit: 'Sunrise or sunset for dramatic skyline silhouettes'
  },

  // ==========================================
  // BANGKOK, THAILAND
  // ==========================================
  {
    id: 'grand-palace-bangkok',
    destinationId: 'bangkok',
    name: 'The Grand Palace & Wat Phra Kaew',
    category: 'Royal Temple Complex',
    location: 'Na Phra Lan Rd, Phra Borom Maha Ratchawang, Bangkok',
    shortDescription: 'The dazzling royal complex housing the revered Emerald Buddha carved from a single jade block.',
    overview: 'Established in 1782, the Grand Palace showcases breathtaking Thai craftsmanship with golden stupas, mosaic-covered spires, and mythical demon guardian statues safeguarding Wat Phra Kaew.',
    estimatedVisitTime: '2.5 Hours',
    featured: true,
    highlights: ['Emerald Buddha (Phra Kaew Morakot)', 'Golden Phra Sri Rattana Chedi', 'Intricate Ramakien Epic Murals'],
    bestTimeToVisit: '8:30 AM before midday tropical heat'
  },
  {
    id: 'wat-arun',
    destinationId: 'bangkok',
    name: 'Wat Arun (Temple of Dawn)',
    category: 'Riverside Historic Shrine',
    location: 'Bangkok Yai, Chao Phraya River, Bangkok',
    shortDescription: 'A towering 70-meter porcelain-encrusted prang rising over the west bank of the Chao Phraya River.',
    overview: 'Wat Arun catches the first morning light and reflects glowing sunset colors across the river. Its central spire is decorated with thousands of pieces of colorful Chinese porcelain and seashell mosaics.',
    estimatedVisitTime: '1.5 Hours',
    featured: false,
    highlights: ['Porcelain-Encrusted Central Prang', 'Chao Phraya River Cross-Ferry Ride', 'Steep Ascent to River Panorama Terraces'],
    bestTimeToVisit: 'Late afternoon to catch sunset across the river'
  },
  {
    id: 'chatuchak-market',
    destinationId: 'bangkok',
    name: 'Chatuchak Weekend Market',
    category: 'Mega Bazaar',
    location: 'Kamphaeng Phet 2 Rd, Chatuchak, Bangkok',
    shortDescription: 'One of the world\'s largest open-air weekend markets spanning over 15,000 artisan and food stalls.',
    overview: 'From vintage clothing and handmade teak handicrafts to live street food demonstrations and coconut ice cream, Chatuchak is an exhilarating sensory celebration of Thai commerce and culinary delights.',
    estimatedVisitTime: '3 Hours',
    featured: false,
    highlights: ['Over 15,000 Independent Stalls', 'Famous Coconut Ice Cream in Husk', 'Authentic Thai Silk & Teak Handicrafts'],
    bestTimeToVisit: 'Saturday or Sunday morning from 9:30 AM'
  },

  // ==========================================
  // GOA, INDIA
  // ==========================================
  {
    id: 'basilica-bom-jesus',
    destinationId: 'goa',
    name: 'Basilica of Bom Jesus',
    category: 'UNESCO World Heritage Site',
    location: 'Old Goa, India',
    shortDescription: 'A 16th-century Baroque church holding the sacred relics of St. Francis Xavier in Old Goa.',
    overview: 'Constructed in 1605, the Basilica of Bom Jesus is one of the finest examples of Baroque architecture in India. Its unplastered red laterite stone facade and intricately gilded wooden altars make it a cornerstone of Goan cultural heritage.',
    estimatedVisitTime: '1-1.5 Hours',
    featured: true,
    highlights: ['Sacred Relics of St. Francis Xavier', 'Ornate Gilded Main Altar', 'Historic Portuguese Laterite Architecture'],
    bestTimeToVisit: 'Morning between 9:00 AM - 11:30 AM'
  },
  {
    id: 'fort-aguada',
    destinationId: 'goa',
    name: 'Fort Aguada & Lighthouse',
    category: 'Historic Fortress',
    location: 'Sinquerim Beach, Candolim, North Goa',
    shortDescription: 'A 17th-century Portuguese fortress overlooking the vast Arabian Sea and the Mandovi estuary.',
    overview: 'Built in 1612 to guard against Dutch attacks, Fort Aguada features well-preserved bastions, an ancient four-tiered freshwater storage reservoir, and Asia\'s oldest four-story lighthouse standing atop the cliff.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: false,
    highlights: ['Panoramic Arabian Sea Clifftop Views', 'Historical Portuguese Four-Tiered Lighthouse', 'Upper Fort Ramparts & Moat Walk'],
    bestTimeToVisit: '4:30 PM for sunset over the sea'
  },
  {
    id: 'dudhsagar-falls',
    destinationId: 'goa',
    name: 'Dudhsagar Waterfalls',
    category: 'Natural Wonder',
    location: 'Bhagwan Mahaveer Sanctuary, Goa-Karnataka Border',
    shortDescription: 'A dramatic four-tiered 310-meter waterfall resembling a sea of milk cascading down the Western Ghats.',
    overview: 'One of India\'s tallest waterfalls, Dudhsagar roars through lush deciduous rainforest. Famous for the picturesque railway arch bridge spanning directly in front of the cascades, it is reached by exciting open-top jeep safaris.',
    estimatedVisitTime: '4-5 Hours (Day Trip)',
    featured: false,
    highlights: ['Four-Tiered 310m Cascading Waterfall', 'Bhagwan Mahaveer Wildlife Jeep Safari', 'Natural Freshwater Pool at Base'],
    bestTimeToVisit: 'October - February after monsoon rains'
  },

  // ==========================================
  // JAIPUR, INDIA
  // ==========================================
  {
    id: 'amber-fort',
    destinationId: 'jaipur',
    name: 'Amber Fort & Sheesh Mahal',
    category: 'Hilltop Fortress',
    location: 'Amer, Jaipur, Rajasthan',
    shortDescription: 'Majestic 16th-century Rajput fort overlooking Maota Lake, famed for the glittering Mirror Palace.',
    overview: 'Built from yellow and pink sandstone, Amber Fort is a masterpiece of Rajputana grandeur. Wander through grand courtyards, the hall of public audience, and the Sheesh Mahal (Mirror Palace) where thousands of convex mirrors reflect candlelight into starry constellations.',
    estimatedVisitTime: '2.5-3 Hours',
    featured: true,
    highlights: ['Sheesh Mahal (Glittering Mirror Palace)', 'Maota Lake & Kesar Kyari Garden View', 'Ganesh Pol Ornate Painted Gateway'],
    bestTimeToVisit: 'Early morning at 8:30 AM or during evening light show'
  },
  {
    id: 'hawa-mahal',
    destinationId: 'jaipur',
    name: 'Hawa Mahal (Palace of Winds)',
    category: 'Historic Monument',
    location: 'Badi Choupad, Pink City, Jaipur',
    shortDescription: 'A five-story pink sandstone palace featuring 953 honeycomb jharokhas designed for royal breeze flow.',
    overview: 'Built in 1799 by Maharaja Sawai Pratap Singh, Hawa Mahal allowed royal women to observe street festivals without being seen from outside. Its pyramid-shaped facade resembles the crown of Lord Krishna and cools the palace interior through Venturi breeze physics.',
    estimatedVisitTime: '1 Hour',
    featured: true,
    highlights: ['953 Intricately Carved Jharokha Windows', 'Rooftop Cafe Vantage Points across the Street', 'Stained-Glass Window Light Projections'],
    bestTimeToVisit: 'Early morning when golden sunrise illuminates the facade'
  },
  {
    id: 'city-palace-jaipur',
    destinationId: 'jaipur',
    name: 'City Palace of Jaipur',
    category: 'Royal Palace Complex',
    location: 'Old City, Jaipur',
    shortDescription: 'The royal residence combining Mughal and Rajput architecture with grand courtyards and art galleries.',
    overview: 'Occupying a seventh of Jaipur\'s walled city, the City Palace is home to the descendants of the Jaipur royal family. Highlights include the Peacock Courtyard in Pritam Niwas Chowk, the Maharaja Sawai Man Singh II Museum, and giant sterling silver vessels.',
    estimatedVisitTime: '2 Hours',
    featured: false,
    highlights: ['Peacock Gate in Pritam Niwas Chowk', 'World’s Largest Sterling Silver Water Urns', 'Royal Armoury & Textile Collections'],
    bestTimeToVisit: 'Morning or mid-afternoon'
  },

  // ==========================================
  // MANALI, INDIA
  // ==========================================
  {
    id: 'solang-valley',
    destinationId: 'manali',
    name: 'Solang Valley',
    category: 'Himalayan Adventure Arena',
    location: 'Solang Valley, Manali, Himachal Pradesh',
    shortDescription: 'A scenic high-altitude valley famous for paragliding, zorbing, snow skiing, and alpine cable cars.',
    overview: 'Located 14 km from Manali, Solang Valley is Himachal\'s premier adventure hub. Surrounded by glacier-capped Himalayan peaks, visitors enjoy tandem paragliding in summer and thrilling snow sports on powdery slopes in winter.',
    estimatedVisitTime: '3-4 Hours',
    featured: true,
    highlights: ['Tandem Paragliding over Valley Ravines', 'Solang Ropeway Scenic Cable Car Ride', 'Winter Snowmobile & Skiing Slopes'],
    bestTimeToVisit: 'December - February (Snow) or April - June (Paragliding)'
  },
  {
    id: 'hadimba-temple',
    destinationId: 'manali',
    name: 'Hadimba Devi Ancient Temple',
    category: 'Cedar Forest Shrine',
    location: 'Dhungri Forest, Manali, Himachal Pradesh',
    shortDescription: 'A 1553 AD pagoda-style wooden temple nestled inside a dense sacred deodar cedar forest.',
    overview: 'Dedicated to Hadimba Devi from the Mahabharata, this unique four-tiered pagoda shrine is carved with mythological wooden reliefs, standing tranquil among towering Himalayan deodar trees.',
    estimatedVisitTime: '1 Hour',
    featured: false,
    highlights: ['Four-Tiered Pagoda Wooden Roof Structure', 'Ancient Dhungri Cedar Forest Trails', 'Intricate Wooden Animal Relief Carvings'],
    bestTimeToVisit: 'Morning for tranquil forest strolls'
  },
  {
    id: 'atal-tunnel',
    destinationId: 'manali',
    name: 'Atal Tunnel & Sissu Valley',
    category: 'High Mountain Pass',
    location: 'Pir Panjal Range, Manali-Lahaul Highway',
    shortDescription: 'The world\'s longest highway tunnel above 10,000 feet, opening into the surreal snow landscapes of Lahaul.',
    overview: 'Spanning 9.02 kilometers beneath Rohtang Pass, the Atal Tunnel is an engineering marvel that instantly transports travelers from lush green Kullu into the dramatic arid snow peaks and frozen waterfalls of Sissu in Lahaul Valley.',
    estimatedVisitTime: '4 Hours',
    featured: false,
    highlights: ['9.02km Highway Tunnel Transit', 'Sissu Waterfall & Glacial Stream in Lahaul', 'Panoramic Pir Panjal Snow Vistas'],
    bestTimeToVisit: 'Early morning to afternoon'
  },

  // ==========================================
  // CHENNAI, INDIA
  // ==========================================
  {
    id: 'kapaleeshwarar-temple',
    destinationId: 'chennai',
    name: 'Kapaleeshwarar Ancient Temple',
    category: 'Dravidian Temple',
    location: 'Mylapore, Chennai, Tamil Nadu',
    shortDescription: 'A magnificent 7th-century Dravidian temple adorned with a multi-tiered rainbow gopuram tower.',
    overview: 'Dedicated to Lord Shiva in the form of Kapaleeshwarar, this temple in ancient Mylapore is celebrated for its towering 37-meter gopuram carved with hundreds of stucco deities, a vast sacred temple tank, and traditional Carnatic music ceremonies.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: true,
    highlights: ['Rainbow-Carved Dravidian Gopuram Spire', 'Historic Temple Water Tank', 'Mylapore Heritage Street Bazaars'],
    bestTimeToVisit: 'Early morning or evening aarti ceremony'
  },
  {
    id: 'marina-beach',
    destinationId: 'chennai',
    name: 'Marina Beach',
    category: 'Urban Coastal Beach',
    location: 'Kamarajar Promenade, Chennai',
    shortDescription: 'The world\'s second-longest natural urban beach stretching 13 kilometers along the Bay of Bengal.',
    overview: 'Marina Beach is the heartbeat of Chennai\'s social life. Enjoy evening sea breezes, walk past historic colonial statues along the promenade, savor fresh beach sundal and fish fry, and watch golden sunrises over the Bay of Bengal.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: false,
    highlights: ['13km Natural Golden Sand Coastline', 'Historic Statues along Kamarajar Promenade', 'Fresh Evening Street Snacks & Filter Coffee'],
    bestTimeToVisit: '5:30 AM for sunrise or 5:00 PM for cool evening breezes'
  },
  {
    id: 'san-thome-basilica',
    destinationId: 'chennai',
    name: 'San Thome Cathedral Basilica',
    category: 'Neo-Gothic Cathedral',
    location: 'Santhome High Rd, Mylapore, Chennai',
    shortDescription: 'A historic white neo-Gothic cathedral built over the tomb of St. Thomas the Apostle.',
    overview: 'Constructed by Portuguese explorers in the 16th century and rebuilt in neo-Gothic style by the British, San Thome Basilica is one of only three known basilicas in the world built directly over the tomb of an apostle of Jesus Christ.',
    estimatedVisitTime: '1 Hour',
    featured: false,
    highlights: ['Tomb Chapel of St. Thomas', 'Neo-Gothic Stained-Glass Windows & Spire', 'Historic Museum of Relics'],
    bestTimeToVisit: 'Morning or late afternoon'
  },

  // ==========================================
  // MUMBAI, INDIA
  // ==========================================
  {
    id: 'gateway-of-india',
    destinationId: 'mumbai',
    name: 'Gateway of India',
    category: 'Colonial Monument',
    location: 'Apollo Bunder, Colaba, South Mumbai',
    shortDescription: 'An iconic 26-meter basalt arch overlooking Mumbai Harbour and the Arabian Sea.',
    overview: 'Erected to commemorate the 1911 royal visit of King George V, the Gateway of India combines Indo-Saracenic architectural motifs with Roman triumphal arch design, standing alongside the historic Taj Mahal Palace Hotel.',
    estimatedVisitTime: '1-1.5 Hours',
    featured: true,
    highlights: ['Indo-Saracenic Basalt Archway', 'Taj Mahal Palace Hotel View', 'Ferry Departures to Elephanta Caves'],
    bestTimeToVisit: 'Sunset or early morning breeze'
  },
  {
    id: 'marine-drive',
    destinationId: 'mumbai',
    name: 'Marine Drive (Queen\'s Necklace)',
    category: 'Arabian Sea Promenade',
    location: 'Netaji Subhash Chandra Bose Rd, South Mumbai',
    shortDescription: 'A 3.6-kilometer C-shaped coastal boulevard creating a glittering string of pearl lights at night.',
    overview: 'Lined with Art Deco heritage buildings and tetrapod breakwaters, Marine Drive is Mumbai\'s most beloved gathering spot for romantic evening strolls, Arabian Sea sunsets, and watching the city\'s illuminated curve.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: true,
    highlights: ['Queen\'s Necklace Night Illumination', 'Art Deco UNESCO Heritage Ensembles', 'Arabian Sea Sunset Breeze'],
    bestTimeToVisit: '5:30 PM until late night'
  },
  {
    id: 'elephanta-caves',
    destinationId: 'mumbai',
    name: 'Elephanta Island Rock-Cut Caves',
    category: 'UNESCO World Heritage Site',
    location: 'Gharapuri Island, Mumbai Harbour',
    shortDescription: '6th-century rock-cut basalt cave temples dedicated to Lord Shiva, reached by harbour ferry.',
    overview: 'Located a 50-minute scenic boat ride from the Gateway of India, the Elephanta Caves house monumental stone sculptures including the celebrated 20-foot three-headed Trimurti Shiva sculpture.',
    estimatedVisitTime: '3-4 Hours (Half Day)',
    featured: false,
    highlights: ['20-Foot Trimurti Sadashiva Sculpture', 'Ancient Rock-Cut Cave Architecture', 'Scenic Harbour Ferry Transit'],
    bestTimeToVisit: 'Morning ferry before midday sun'
  },

  // ==========================================
  // SANTORINI, GREECE
  // ==========================================
  {
    id: 'oia-sunset-castle',
    destinationId: 'santorini',
    name: 'Oia Sunset Castle & Blue Domes',
    category: 'Scenic Viewpoint',
    location: 'Oia Village, Santorini, Greece',
    shortDescription: 'The world\'s most famous caldera viewpoint overlooking whitewashed cliff houses and blue church domes.',
    overview: 'Perched on the northern tip of Santorini, the ruins of Byzantine Castle in Oia provide an unforgettable golden-hour perspective as the Mediterranean sun sets over the Aegean Sea and caldera waters.',
    estimatedVisitTime: '2 Hours',
    featured: true,
    highlights: ['Iconic Three Blue Domes Photo Spot', 'Panoramic Caldera Golden Hour', 'Whitewashed Windmills & Clifftop Alleys'],
    bestTimeToVisit: '2 hours before sunset'
  },
  {
    id: 'red-beach-santorini',
    destinationId: 'santorini',
    name: 'Red Beach & Akrotiri Ruins',
    category: 'Volcanic Natural Wonder',
    location: 'Akrotiri, Southern Santorini',
    shortDescription: 'Towering rust-red volcanic cliffs dropping into crystal turquoise Aegean waters near prehistoric ruins.',
    overview: 'Formed from red and black pulverized volcanic lava, Red Beach offers an otherworldly color contrast. Nearby lie the Akrotiri archaeological excavations, a remarkably preserved Bronze Age Minoan port city.',
    estimatedVisitTime: '2.5 Hours',
    featured: false,
    highlights: ['Rust-Red Volcanic Rock Formations', 'Ancient Akrotiri Archaeological Site', 'Clear Turquoise Swimming Waters'],
    bestTimeToVisit: 'Morning for calm waters and fewer crowds'
  },

  // ==========================================
  // ZERMATT, SWITZERLAND
  // ==========================================
  {
    id: 'matterhorn-peak',
    destinationId: 'zermatt',
    name: 'Matterhorn Peak & Gornergrat Railway',
    category: 'Natural Alpine Wonder',
    location: 'Zermatt, Valais, Swiss Alps',
    shortDescription: 'The iconic 4,478-meter pyramid peak of the Alps, reached via open-air cogwheel mountain railway.',
    overview: 'The Matterhorn is the undisputed emblem of the Swiss Alps. Taking the historic Gornergrat cogwheel train up to 3,089 meters delivers jaw-dropping views of 29 peaks exceeding 4,000 meters and the mighty Gorner Glacier.',
    estimatedVisitTime: '3-4 Hours',
    featured: true,
    highlights: ['Gornergrat 3,089m Mountain Panorama', 'Riffelsee Mirror Reflection of Matterhorn', 'Matterhorn Glacier Paradise View'],
    bestTimeToVisit: 'Morning on clear blue-sky days'
  },
  {
    id: 'five-lakes-walk',
    destinationId: 'zermatt',
    name: 'Five Lakes Alpine Walk (5-Seenweg)',
    category: 'Mountain Trekking Trail',
    location: 'Sunnegga-Blauherd, Zermatt',
    shortDescription: 'A scenic 9-kilometer alpine trail passing five glacial lakes reflecting the Matterhorn.',
    overview: 'One of the most photogenic day hikes in the Alps, the 5-Seenweg trail weaves past Stellisee, Grindjisee, Grünsee, Moosjisee, and Leisee, each providing mirror reflections of the Matterhorn across turquoise waters.',
    estimatedVisitTime: '3-4 Hours',
    featured: false,
    highlights: ['Stellisee Matterhorn Mirror Reflection', 'Alpine Meadow Wildflowers', 'Sunnegga Panoramic Cable Car'],
    bestTimeToVisit: 'June to September'
  },

  // ==========================================
  // AMALFI COAST, ITALY
  // ==========================================
  {
    id: 'positano-cliffside',
    destinationId: 'amalfi-coast',
    name: 'Positano Spiaggia Grande & Alleys',
    category: 'Coastal Clifftop Village',
    location: 'Positano, Amalfi Coast, Campania, Italy',
    shortDescription: 'Dramatic vertical cascade of pastel pink and yellow villas tumbling down to the azure sea.',
    overview: 'Positano is the jewel of the Amalfi Coast. Explore bougainvillea-covered pedestrian stairways, browse artisan linen shops, and enjoy fresh limoncello and seafood pasta along the famous Spiaggia Grande beach.',
    estimatedVisitTime: '3 Hours',
    featured: true,
    highlights: ['Spiaggia Grande Panoramic Beach View', 'Church of Santa Maria Assunta Majolica Dome', 'Path of the Gods Cliffside Hiking Route'],
    bestTimeToVisit: 'Morning or late afternoon'
  },
  {
    id: 'villa-rufolo-ravello',
    destinationId: 'amalfi-coast',
    name: 'Villa Rufolo & Ravello Terraces',
    category: 'Panoramic Historic Garden',
    location: 'Piazza Duomo, Ravello, Amalfi Coast',
    shortDescription: 'Clifftop 13th-century Moorish villa garden perched 365 meters above the Gulf of Salerno.',
    overview: 'Famous for inspiring Richard Wagner\'s opera Parsifal, Villa Rufolo features multi-tiered botanical gardens and twin pine trees framing endless blue Tyrrhenian Sea vistas.',
    estimatedVisitTime: '2 Hours',
    featured: false,
    highlights: ['Terrace of Infinity Sea Overlook', 'Moorish Cloister & Romanesque Architecture', 'Annual Ravello Classical Music Festival'],
    bestTimeToVisit: 'Late afternoon'
  },

  // ==========================================
  // SYDNEY, AUSTRALIA
  // ==========================================
  {
    id: 'sydney-opera-house',
    destinationId: 'sydney',
    name: 'Sydney Opera House',
    category: 'Architectural World Wonder',
    location: 'Bennelong Point, Sydney Harbour, Australia',
    shortDescription: 'Jørn Utzon’s UNESCO World Heritage masterpiece featuring sweeping sail-like concrete shells.',
    overview: 'One of the 20th century\'s most iconic architectural achievements, the Sydney Opera House hosts world-class musical performances and features the breezy Opera Bar overlooking Sydney Harbour Bridge.',
    estimatedVisitTime: '2 Hours',
    featured: true,
    highlights: ['Architectural Sail Shells & Forecourt', 'Interior Concert Hall Guided Tour', 'Opera Bar Sunset Vistas of Harbour Bridge'],
    bestTimeToVisit: 'Afternoon leading into twilight'
  },
  {
    id: 'bondi-to-coogee',
    destinationId: 'sydney',
    name: 'Bondi to Coogee Coastal Walk',
    category: 'Ocean Cliffside Trail',
    location: 'Eastern Suburbs Coastal Path, Sydney',
    shortDescription: 'A 6-kilometer cliff-top coastal trail connecting Sydney\'s most scenic beaches and ocean pools.',
    overview: 'This scenic boardwalk hugs sandstone cliffs, passing golden beaches like Tamarama and Bronte, the heritage Waverley Cemetery perched over crashing waves, and the iconic Bondi Icebergs ocean saltwater pool.',
    estimatedVisitTime: '2.5 Hours',
    featured: false,
    highlights: ['Bondi Icebergs Ocean Pool View', 'Bronte Beach & Tamarama Coves', 'Dramatic Sandstone Ocean Cliff Formations'],
    bestTimeToVisit: 'Early morning sunrise'
  },

  // ==========================================
  // CAPE TOWN, SOUTH AFRICA
  // ==========================================
  {
    id: 'table-mountain',
    destinationId: 'cape-town',
    name: 'Table Mountain & Cableway',
    category: 'Natural Wonder',
    location: 'Table Mountain National Park, Cape Town',
    shortDescription: 'A level 3-kilometer plateau rising 1,086 meters above Cape Town and two converging oceans.',
    overview: 'One of the New7Wonders of Nature, Table Mountain is reached via a rotating aerial cableway or scenic hiking routes, offering 360-degree vistas over the City Bowl, Camps Bay beaches, and Robben Island.',
    estimatedVisitTime: '2.5-3 Hours',
    featured: true,
    highlights: ['Rotating Aerial Cableway Experience', '360° Overlook of Atlantic & False Bay', 'Diverse Fynbos Botanical Floral Kingdom'],
    bestTimeToVisit: 'Early morning on calm, cloud-free days'
  },
  {
    id: 'boulders-beach-penguins',
    destinationId: 'cape-town',
    name: 'Boulders Beach Penguin Colony',
    category: 'Coastal Wildlife Sanctuary',
    location: 'Simon\'s Town, Cape Peninsula, Cape Town',
    shortDescription: 'Sheltered granite cove home to over 2,000 endangered free-roaming African penguins.',
    overview: 'Located along False Bay, Boulders Beach features raised timber boardwalks that allow close-up observation of wild African penguins nesting, waddling over white sands, and swimming among colossal granite boulders.',
    estimatedVisitTime: '1.5-2 Hours',
    featured: false,
    highlights: ['Close-up African Penguin Encounters', 'Giant Weathered Granite Sea Boulders', 'Safe Sheltered Coastal Swimming Coves'],
    bestTimeToVisit: 'Late morning or early afternoon'
  }
];

/**
 * Get all famous places belonging to a specific destination
 */
export function getFamousPlacesByDestinationId(destinationId) {
  if (!destinationId) return [];
  const normalizedId = destinationId.trim().toLowerCase();
  return FAMOUS_PLACES.filter(
    (place) => place.destinationId?.toLowerCase() === normalizedId
  );
}

export const getFamousPlacesByDestination = getFamousPlacesByDestinationId;

/**
 * Get featured famous places across all destinations (for homepage preview)
 */
export function getFeaturedFamousPlaces(limit = 6) {
  const featured = FAMOUS_PLACES.filter((p) => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Lookup a specific famous place by its ID
 */
export function getFamousPlaceById(placeId) {
  if (!placeId) return null;
  return FAMOUS_PLACES.find((p) => p.id.toLowerCase() === placeId.toLowerCase()) || null;
}

export default FAMOUS_PLACES;
