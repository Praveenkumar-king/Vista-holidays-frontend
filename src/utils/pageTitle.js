import { getDestinationById } from '../data/destinations.js';

/**
 * Exact Vista Holidays brand document title
 */
export const BRAND_TITLE = 'Vista Holidays - Discover Worldwide Destinations✈️❤️🥰';

/**
 * Formats a given page name with the required Vista Holidays brand title suffix.
 * - Home page / empty: returns BRAND_TITLE by itself (no "Home |" prefix).
 * - All other pages: `<Page Name> | <BRAND_TITLE>`
 *
 * @param {string} [pageName]
 * @returns {string}
 */
export function formatPageTitle(pageName) {
  if (!pageName || pageName.trim() === '' || pageName.trim().toLowerCase() === 'home') {
    return BRAND_TITLE;
  }
  return `${pageName.trim()} | ${BRAND_TITLE}`;
}

/**
 * Route-to-Page-Name mapping for static routes
 */
const STATIC_ROUTE_TITLES = {
  // Public Core
  '/': 'Home',
  '/destinations': 'Destinations',
  '/weather': 'Weather',
  '/about': 'About Us',
  '/about-us': 'About Us',

  // Support & Information Public Routes
  '/contact': 'Contact Us',
  '/feedback': 'Feedback Messages',
  '/track-status': 'Track Status',
  '/faq': 'FAQ',
  '/support': 'Support & Tickets',
  '/support-tickets': 'Support & Tickets',

  // Legal & Compliance
  '/terms': 'Terms & Conditions',
  '/terms-and-conditions': 'Terms & Conditions',
  '/privacy': 'Privacy Policy',
  '/privacy-policy': 'Privacy Policy',
  '/cookie-policy': 'Cookie Policy',
  '/cookies': 'Cookie Policy',

  // User Authentication
  '/user/login': 'User Login',
  '/users/login': 'User Login',
  '/user/register': 'User Registration',
  '/users/register': 'User Registration',
  '/user/verify-email': 'Verify Email',
  '/users/verify-email': 'Verify Email',
  '/admin/login': 'Admin Login',

  // User Portal
  '/user': 'User Dashboard',
  '/users': 'User Dashboard',
  '/user/dashboard': 'User Dashboard',
  '/users/dashboard': 'User Dashboard',
  '/user/profile': 'My Profile',
  '/users/profile': 'My Profile',
  '/user/trips': 'My Trips',
  '/user/bookings': 'My Bookings',
  '/users/bookings': 'My Bookings',
  '/bookings': 'My Bookings',
  '/user/ai-assistant': 'AI Travel Assistant',
  '/user/ai-plans': 'AI Travel Plans',
  '/user/saved-destinations': 'Saved Destinations',
  '/user/recent-weather': 'Recent Weather',
  '/user/recent-locations': 'Recent Locations',
  '/user/notifications': 'Notifications',
  '/user/security': 'Security',
  '/user/settings': 'Settings',

  // Admin Portal
  '/admin': 'Admin Dashboard',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/transactions': 'Transactions',
  '/admin/users': 'Users',
  '/admin/support-tickets': 'Support Tickets',
  '/admin/support': 'Support Tickets',
  '/admin/contact': 'Contact Messages',
  '/admin/feedback': 'Feedback Messages',
  '/admin/whats-new': "What's New / Product Updates",
  '/admin/product-updates': "What's New / Product Updates",
  '/admin/announcements': 'Platform Announcements',
  '/admin/platform-announcements': 'Platform Announcements',
  '/admin/maintenance': 'Maintenance Mode',
  '/admin/platform-settings': 'System Settings',
  '/admin/settings': 'System Settings',
  '/admin/analytics': 'Analytics',

  // Special / Error
  '/access-denied': 'Access Denied',
  '/unauthorized': 'Access Denied',
  '/server-error': 'Server Error'
};

/**
 * Resolves the exact page title for any given route pathname.
 *
 * @param {string} pathname
 * @returns {string}
 */
export function resolvePageTitle(pathname) {
  if (!pathname || pathname === '/') {
    return BRAND_TITLE;
  }

  // Normalize path: strip trailing slashes
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();

  // 1. Dynamic Destination Details: /destinations/:id
  if (lowerPath.startsWith('/destinations/')) {
    const destId = cleanPath.replace(/^\/destinations\//i, '').split('/')[0];
    if (destId) {
      const dest = getDestinationById(destId);
      if (dest?.name) {
        return formatPageTitle(dest.name);
      }
      // Format slug into title words if destination ID exists
      const formatted = destId
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      return formatPageTitle(formatted || 'Destinations');
    }
  }

  // 2. Dynamic Admin Details
  if (lowerPath.startsWith('/admin/users/')) {
    return formatPageTitle('User Details');
  }
  if (lowerPath.startsWith('/admin/contact/')) {
    return formatPageTitle('Contact Details');
  }
  if (lowerPath.startsWith('/admin/feedback/')) {
    return formatPageTitle('Feedback Details');
  }

  // 3. Static Route Lookup
  if (STATIC_ROUTE_TITLES[lowerPath]) {
    return formatPageTitle(STATIC_ROUTE_TITLES[lowerPath]);
  }

  // 4. Default 404
  return formatPageTitle('Page Not Found');
}

export default {
  BRAND_TITLE,
  formatPageTitle,
  resolvePageTitle
};
