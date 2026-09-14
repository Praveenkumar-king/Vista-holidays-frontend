/**
 * faqData.js
 * 
 * 36 High-quality, authentic FAQ questions and answers organized across 12 categories
 * tailored specifically for the Vista Holidays travel platform.
 */

export const FAQ_CATEGORIES = [
  { id: 'all', name: 'All Topics', icon: 'Compass' },
  { id: 'getting-started', name: 'Getting Started', icon: 'Sparkles' },
  { id: 'account-auth', name: 'Account & Authentication', icon: 'UserCheck' },
  { id: 'destinations', name: 'Destinations', icon: 'MapPin' },
  { id: 'weather', name: 'Weather Insights', icon: 'CloudSun' },
  { id: 'ai-assistant', name: 'AI Travel Assistant', icon: 'Bot' },
  { id: 'ai-itinerary', name: 'AI Itinerary Planning', icon: 'CalendarDays' },
  { id: 'location-services', name: 'Location Services', icon: 'Navigation' },
  { id: 'saved-trips', name: 'Saved Trips & Preferences', icon: 'Bookmark' },
  { id: 'product-updates', name: 'Product Updates', icon: 'BellRing' },
  { id: 'support-contact', name: 'Support & Contact', icon: 'Headphones' },
  { id: 'privacy-security', name: 'Privacy & Security', icon: 'ShieldCheck' },
  { id: 'general', name: 'General Questions', icon: 'HelpCircle' }
];

export const FAQ_ITEMS = [
  // 1. Getting Started
  {
    id: 'gs-1',
    categoryId: 'getting-started',
    categoryName: 'Getting Started',
    question: 'What is Vista Holidays and what makes it unique?',
    answer: 'Vista Holidays is a next-generation intelligent travel companion designed to elevate your journey from inspiration to exploration. We unite curated global destination guides, high-definition place photography, real-time OpenWeather insights, and Google Gemini AI-driven itinerary planning in one seamless, modern platform.',
    tags: ['about', 'features', 'overview', 'platform', 'introduction']
  },
  {
    id: 'gs-2',
    categoryId: 'getting-started',
    categoryName: 'Getting Started',
    question: 'How do I start planning my holiday with Vista Holidays?',
    answer: 'You can begin by exploring our Top Destinations directory to discover popular countries, cities, and landmarks. Use the interactive filters to sort by continent, climate, or activity. When you find an inspiring place, tap on it to view live weather forecasts, famous tourist attractions, and launch our Smart Trip Builder to create a day-by-day itinerary.',
    tags: ['planning', 'start', 'explore', 'trip builder', 'guide']
  },
  {
    id: 'gs-3',
    categoryId: 'getting-started',
    categoryName: 'Getting Started',
    question: 'Do I need an account to browse destinations and weather insights?',
    answer: 'No. Vista Holidays allows public access to explore destination highlights, famous places, and current weather forecasts without requiring immediate sign-up. However, creating a free account unlocks personalized AI itinerary generation, support ticket management, feedback submissions, and saved preferences.',
    tags: ['guest', 'account requirement', 'free access', 'browse']
  },

  // 2. Account & Authentication
  {
    id: 'auth-1',
    categoryId: 'account-auth',
    categoryName: 'Account & Authentication',
    question: 'How does the email verification process work?',
    answer: 'When you register for a Vista Holidays account, we immediately send a secure, personalized verification link to your registered email address. Clicking the link verifies your identity, activates your account, and dispatches an official Welcome Email to confirm that your account is ready for use.',
    tags: ['verify', 'email verification', 'activation', 'register', 'welcome email']
  },
  {
    id: 'auth-2',
    categoryId: 'account-auth',
    categoryName: 'Account & Authentication',
    question: 'What should I do if I did not receive my account verification email?',
    answer: 'Check your spam or junk folder first. If it is not there, visit the Resend Verification page or attempt to sign in with your credentials; you will see an option to trigger a fresh verification email. For security and email deliverability, each verification link is active for 24 hours.',
    tags: ['resend', 'token expired', 'missing email', 'spam', 'activation link']
  },
  {
    id: 'auth-3',
    categoryId: 'account-auth',
    categoryName: 'Account & Authentication',
    question: 'Why am I asked to accept the Terms & Conditions after first sign-in?',
    answer: 'To safeguard user privacy, data integrity, and ensure responsible AI usage across our travel tools, all travelers must review and accept our updated platform Terms & Conditions upon their first authenticated session. Once accepted, you will not be prompted again unless our terms undergo a major version update.',
    tags: ['terms', 'privacy policy', 'agreement', 'first login', 'compliance']
  },

  // 3. Destinations
  {
    id: 'dest-1',
    categoryId: 'destinations',
    categoryName: 'Destinations',
    question: 'How are destinations curated and rated on Vista Holidays?',
    answer: 'Our travel intelligence team handpicks top destinations based on traveler popularity, cultural significance, safety ratings, and geographical diversity. Each destination profile includes comprehensive background notes, best seasons to visit, average budget tiers, and top-rated local activities.',
    tags: ['curation', 'ratings', 'reviews', 'top places', 'travel guide']
  },
  {
    id: 'dest-2',
    categoryId: 'destinations',
    categoryName: 'Destinations',
    question: 'Can I view famous places and landmarks for each destination?',
    answer: 'Yes! Every destination page features a dedicated Famous Places section featuring high-resolution photography powered by Pexels, historical overviews, visitor tips, accessibility information, and approximate visit durations.',
    tags: ['landmarks', 'monuments', 'attractions', 'places to visit', 'photos']
  },
  {
    id: 'dest-3',
    categoryId: 'destinations',
    categoryName: 'Destinations',
    question: 'How often is destination information and imagery updated?',
    answer: 'Our editorial team and automated syndication systems refresh travel destination guides, seasonal tips, and photo libraries on a continuous weekly schedule. If local travel advisory alerts change, updates are posted immediately.',
    tags: ['updates', 'freshening', 'photography', 'advisories', 'information']
  },

  // 4. Weather Insights
  {
    id: 'wth-1',
    categoryId: 'weather',
    categoryName: 'Weather Insights',
    question: 'How does the live Weather Insights feature work?',
    answer: 'Our Weather Insights engine integrates directly with the OpenWeather API to provide real-time temperature, "feels like" heat index, humidity levels, wind velocity, atmospheric pressure, sunrise/sunset times, and multi-day forecasts for any chosen travel destination.',
    tags: ['openweather', 'temperature', 'forecast', 'live weather', 'climate']
  },
  {
    id: 'wth-2',
    categoryId: 'weather',
    categoryName: 'Weather Insights',
    question: 'Can I check multi-day and hourly weather forecasts for destinations?',
    answer: 'Yes. By navigating to the Weather page or viewing an individual destination profile, you can inspect 5-day weather forecasts along with hourly temperature fluctuations to help you pack accurately and pick ideal outdoor exploration days.',
    tags: ['5 day forecast', 'hourly', 'packing tips', 'rain radar', 'temperature']
  },
  {
    id: 'wth-3',
    categoryId: 'weather',
    categoryName: 'Weather Insights',
    question: 'Which weather data provider powers Vista Holidays?',
    answer: 'We utilize official enterprise OpenWeather endpoints combined with local geolocation coordinates to guarantee rapid, globally accurate, and meteorological-grade climate information.',
    tags: ['provider', 'api', 'accuracy', 'meteorology']
  },

  // 5. AI Travel Assistant
  {
    id: 'ai-1',
    categoryId: 'ai-assistant',
    categoryName: 'AI Travel Assistant',
    question: 'How does the Gemini AI Travel Assistant help me plan?',
    answer: 'Powered by Google Gemini generative models, our floating AI Assistant acts as your on-demand personal travel concierge. It answers questions about local customs, currency exchange, visa guidelines, vegetarian dining options, packing essentials, and hidden gems.',
    tags: ['gemini', 'chat', 'bot', 'concierge', 'artificial intelligence', 'assistant']
  },
  {
    id: 'ai-2',
    categoryId: 'ai-assistant',
    categoryName: 'AI Travel Assistant',
    question: 'What kinds of travel questions can I ask the AI Assistant?',
    answer: 'You can ask anything travel-related! Popular prompts include: "What are the best 3-day walking tours in Kyoto?", "Suggest kid-friendly activities in Paris in winter", "What should I wear when visiting temples in Bali?", and "What is the typical tipping etiquette in Rome?".',
    tags: ['prompts', 'questions', 'tips', 'recommendations', 'local advice']
  },
  {
    id: 'ai-3',
    categoryId: 'ai-assistant',
    categoryName: 'AI Travel Assistant',
    question: 'Is the AI Travel Assistant available on all pages?',
    answer: 'Yes. The AI Assistant lives in a convenient floating widget in the bottom-right corner of your screen across the entire application, allowing you to ask queries at any point without losing your place or page progress.',
    tags: ['floating widget', 'availability', 'global', 'dock']
  },

  // 6. AI Itinerary Planning
  {
    id: 'itin-1',
    categoryId: 'ai-itinerary',
    categoryName: 'AI Itinerary Planning',
    question: 'How does the Smart Trip Builder generate personalized itineraries?',
    answer: 'The Smart Trip Builder combines your chosen destination, travel dates, trip duration, group type (solo, couple, family, friends), and travel style (relaxed, cultural, adventure, foodie) with Gemini AI to generate structured, realistic day-by-day schedules complete with morning, afternoon, and evening activities.',
    tags: ['trip builder', 'itinerary', 'schedule', 'custom trip', 'gemini']
  },
  {
    id: 'itin-2',
    categoryId: 'ai-itinerary',
    categoryName: 'AI Itinerary Planning',
    question: 'Can I customize travel pace, budget, and trip duration in my itinerary?',
    answer: 'Absolutely. You can choose your preferred pacing (Fast-paced Highlights vs. Relaxed & Leisurely) and budget tiers (Backpacker, Moderate, Luxury). The planner automatically selects compatible transit modes, dining suggestions, and attractions matching your criteria.',
    tags: ['budget', 'pacing', 'customization', 'duration', 'travel style']
  },
  {
    id: 'itin-3',
    categoryId: 'ai-itinerary',
    categoryName: 'AI Itinerary Planning',
    question: 'Can I export or save my generated AI itineraries?',
    answer: 'Yes. Generated itineraries can be saved to your traveler profile, printed, or exported for offline access so you can easily reference your itinerary during your trip without constant cellular connectivity.',
    tags: ['export', 'offline', 'save itinerary', 'print', 'pdf']
  },

  // 7. Location Services
  {
    id: 'loc-1',
    categoryId: 'location-services',
    categoryName: 'Location Services',
    question: 'How does Vista Holidays use my location?',
    answer: 'When you grant location permissions in your browser, Vista Holidays calculates your current city to automatically show nearby destinations, local weather insights, and domestic travel recommendations directly in the navigation bar and hero section.',
    tags: ['gps', 'geolocation', 'nearby', 'current city', 'permissions']
  },
  {
    id: 'loc-2',
    categoryId: 'location-services',
    categoryName: 'Location Services',
    question: 'Can I manually search and select a location instead of using GPS?',
    answer: 'Yes. If you prefer not to share your device location or if you are planning for a future departure city, you can use our global location search bar to manually pick any city, state, or country worldwide.',
    tags: ['manual search', 'location picker', 'privacy', 'no gps']
  },
  {
    id: 'loc-3',
    categoryId: 'location-services',
    categoryName: 'Location Services',
    question: 'Is my precise location shared with third parties?',
    answer: 'Never. Your geolocation data is processed client-side solely for immediate weather queries and proximity filtering. We never sell, track, or share your GPS coordinates with third-party advertising networks.',
    tags: ['location privacy', 'third party', 'tracking', 'data safety']
  },

  // 8. Saved Trips & Preferences
  {
    id: 'save-1',
    categoryId: 'saved-trips',
    categoryName: 'Saved Trips & Preferences',
    question: 'How do I bookmark favorite destinations and places?',
    answer: 'When signed in, you can click the bookmark/heart icon on any destination card or famous place detail modal. Your saved items sync immediately with your user account and can be reviewed anytime under your Traveler Dashboard.',
    tags: ['bookmark', 'favorites', 'wishlist', 'heart', 'save place']
  },
  {
    id: 'save-2',
    categoryId: 'saved-trips',
    categoryName: 'Saved Trips & Preferences',
    question: 'Can I customize my traveler profile and travel preferences?',
    answer: 'Yes. In your account settings, you can define your preferred home departure airport, dietary considerations (vegetarian, vegan, halal, gluten-free), default currency, and preferred climate types to receive personalized destination suggestions.',
    tags: ['profile', 'preferences', 'settings', 'currency', 'dietary']
  },
  {
    id: 'save-3',
    categoryId: 'saved-trips',
    categoryName: 'Saved Trips & Preferences',
    question: 'How do I access my saved itineraries and travel history?',
    answer: 'Navigate to your Profile menu and choose "My Trips". Here, you will find your active itineraries, saved draft schedules, previously completed journeys, and bookmarked destinations categorized neatly.',
    tags: ['my trips', 'history', 'saved itineraries', 'past journeys']
  },

  // 9. Product Updates
  {
    id: 'prod-1',
    categoryId: 'product-updates',
    categoryName: 'Product Updates',
    question: 'Where can I find new platform releases and feature announcements?',
    answer: 'We maintain an interactive "What\'s New" product updates drawer accessible directly from the platform. It features illustrated slide presentations and release notes explaining new travel tools, AI capabilities, and system enhancements.',
    tags: ['whats new', 'releases', 'changelog', 'announcements', 'features']
  },
  {
    id: 'prod-2',
    categoryId: 'product-updates',
    categoryName: 'Product Updates',
    question: 'How do the "What\'s New" release notifications work?',
    answer: 'When a new platform version or major feature is published, a subtle notification badge appears on the interface. Opening the modal marks the update as viewed in your browser local storage so you stay informed without repeated interruptions.',
    tags: ['badges', 'notifications', 'modal', 'storage', 'alerts']
  },
  {
    id: 'prod-3',
    categoryId: 'product-updates',
    categoryName: 'Product Updates',
    question: 'How frequently does Vista Holidays release new travel features?',
    answer: 'Our engineering and product teams ship feature improvements, security patches, and performance optimizations bi-weekly, continuously enhancing the travel discovery experience.',
    tags: ['release schedule', 'updates', 'deployments', 'engineering']
  },

  // 10. Support & Contact
  {
    id: 'supp-1',
    categoryId: 'support-contact',
    categoryName: 'Support & Contact',
    question: 'How do I submit a support ticket or inquiry?',
    answer: 'Head to our Contact Support page (/contact). Fill in your contact details, select an inquiry category (such as Booking Assistance, Custom Holiday Package, or Technical Support), type your message, and submit. You will receive a unique ticket reference (e.g., Vista-CON-20260914-001) and an email confirmation.',
    tags: ['contact', 'ticket', 'support', 'helpdesk', 'inquiry']
  },
  {
    id: 'supp-2',
    categoryId: 'support-contact',
    categoryName: 'Support & Contact',
    question: 'How does the Ticket Status Tracking portal work?',
    answer: 'Every submitted Contact Inquiry or Traveler Feedback generates an official ticket ID. Visit the Track Status page (/track-status) and paste your Ticket ID to inspect live timeline milestones, review status updates (Open, In Progress, Resolved, Closed), and read messages sent by the support staff.',
    tags: ['track status', 'ticket id', 'timeline', 'progress', 'status tracking']
  },
  {
    id: 'supp-3',
    categoryId: 'support-contact',
    categoryName: 'Support & Contact',
    question: 'What is the standard response time for traveler support inquiries?',
    answer: 'Our dedicated customer support operations team reviews all incoming inquiries within 24 to 48 hours during business days. Critical travel disruptions and booking assistance requests receive prioritized escalation.',
    tags: ['response time', 'sla', 'support hours', 'turnaround', 'escalation']
  },

  // 11. Privacy & Security
  {
    id: 'sec-1',
    categoryId: 'privacy-security',
    categoryName: 'Privacy & Security',
    question: 'How is my personal data and password secured?',
    answer: 'We employ industry-leading security practices, including salted bcrypt hashing (12 rounds) for passwords, cryptographically random SHA-256 tokens for email verification, encrypted TLS data in transit, and role-based access control for backend administration.',
    tags: ['security', 'passwords', 'encryption', 'bcrypt', 'sha256', 'tls']
  },
  {
    id: 'sec-2',
    categoryId: 'privacy-security',
    categoryName: 'Privacy & Security',
    question: 'How do I recognize legitimate emails from Vista Holidays?',
    answer: 'Official Vista Holidays emails always feature our official logo, dynamic time-based greetings, and an unmissable red Security Notice. Vista Holidays will NEVER ask for your password, OTP, banking details, or sensitive financial information via email.',
    tags: ['phishing', 'spoofing', 'security notice', 'official email', 'safety']
  },
  {
    id: 'sec-3',
    categoryId: 'privacy-security',
    categoryName: 'Privacy & Security',
    question: 'How does Vista Holidays handle cookies and session security?',
    answer: 'We use secure, HttpOnly, SameSite-compliant authentication cookies or stateless JWT tokens configured with finite expiration periods to protect against cross-site scripting (XSS) and cross-site request forgery (CSRF) exploits.',
    tags: ['cookies', 'jwt', 'session', 'xss', 'csrf', 'httponly']
  },

  // 12. General Vista Holidays Questions
  {
    id: 'gen-1',
    categoryId: 'general',
    categoryName: 'General Questions',
    question: 'Is Vista Holidays free for travelers to use?',
    answer: 'Yes! Core features of Vista Holidays—including destination discovery, high-resolution landmarks, live OpenWeather reports, and standard AI travel assistant chats—are 100% free for all registered and guest travelers.',
    tags: ['pricing', 'free', 'cost', 'subscription', 'membership']
  },
  {
    id: 'gen-2',
    categoryId: 'general',
    categoryName: 'General Questions',
    question: 'How can I provide feedback or suggest a new feature?',
    answer: 'We love hearing traveler perspectives! Visit our Traveler Feedback page (/feedback) to submit your overall experience rating, answer survey questions, and propose new destination guides or features you would like to see added.',
    tags: ['feedback', 'suggestions', 'rating', 'feature request', 'survey']
  },
  {
    id: 'gen-3',
    categoryId: 'general',
    categoryName: 'General Questions',
    question: 'Which devices and browsers are officially supported?',
    answer: 'Vista Holidays is crafted as a fully responsive progressive web application. It runs smoothly on modern desktop, tablet, and mobile browsers, including Chrome, Safari, Firefox, Edge, and mobile operating systems (iOS and Android).',
    tags: ['devices', 'browsers', 'mobile', 'ios', 'android', 'responsive', 'chrome', 'safari']
  }
];

export default {
  FAQ_CATEGORIES,
  FAQ_ITEMS
};
