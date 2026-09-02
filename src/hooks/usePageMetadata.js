import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getDestinationById } from '../data/destinations';

/**
 * Hook to dynamically update document title and manage focus/scroll on route changes
 */
export function usePageMetadata() {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === '/') {
      document.title = 'Vista Holidays | Discover Worldwide Destinations & AI Itineraries';
    } else if (pathname === '/destinations') {
      document.title = 'Explore Destinations | Vista Holidays';
    } else if (pathname === '/weather') {
      document.title = 'Weather Insights | Vista Holidays';
    } else if (pathname.startsWith('/destinations/')) {
      const destId = pathname.replace('/destinations/', '').split('/')[0];
      const dest = getDestinationById(destId);
      if (dest) {
        document.title = `${dest.name}, ${dest.country} — Travel Guide & Weather | Vista Holidays`;
      } else {
        document.title = 'Destination Not Found | Vista Holidays';
      }
    } else {
      document.title = 'Page Not Found | Vista Holidays';
    }

    // Scroll to top on route change unless anchor hash is present
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);
}

export default usePageMetadata;
