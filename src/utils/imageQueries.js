/**
 * Utility to generate semantic, high-relevance search queries
 * for destinations and landmark places.
 */

/**
 * Generate a destination search query for external photography APIs
 * @param {Object} destination - Destination object
 * @returns {string} Clean search query
 */
export function getDestinationImageQuery(destination) {
  if (!destination) return 'travel destination landscape';

  const name = destination.name || '';
  const country = destination.country || '';
  const category = destination.category ? ` ${destination.category}` : '';

  // Tailored query optimizing for iconic landscape photos
  return `${name} ${country}${category} travel landmark`.trim();
}

/**
 * Generate a famous place search query for external photography APIs
 * @param {Object} place - Famous place object
 * @param {string} destinationName - Optional parent destination name
 * @returns {string} Clean search query
 */
export function getFamousPlaceImageQuery(place, destinationName = '') {
  if (!place) return 'famous landmark travel';

  const name = place.name || '';
  const location = destinationName || (place.location ? place.location.split(',')[0] : '');

  return `${name} ${location} landmark`.trim();
}

export default {
  getDestinationImageQuery,
  getFamousPlaceImageQuery
};
