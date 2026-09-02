import { apiClient } from './api';

/**
 * Service for communicating with backend Gemini AI Travel Assistant & Itinerary endpoints
 */

/**
 * Send conversational chat message to Gemini
 */
export async function sendChatMessage({
  message,
  conversation = [],
  context = {},
  signal
}) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Message cannot be empty.');
  }

  const endpoint = '/ai/chat';

  return apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      message: message.trim(),
      conversation,
      context
    }),
    signal
  });
}

/**
 * Request a structured, day-by-day itinerary from Gemini via backend
 * @param {Object} payload - { destination, days, travelStyle, interests, budget, travelers, pace, famousPlaces, weather }
 * @param {Object} options - { signal }
 * @returns {Promise<Object>} { success, data: { destination, days, ... } }
 */
export async function generateItineraryPlan(payload, { signal } = {}) {
  if (!payload || !payload.destination?.name) {
    throw new Error('Destination name is required to generate an itinerary.');
  }

  const endpoint = '/ai/itinerary';

  return apiClient(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    signal
  });
}

export default {
  sendChatMessage,
  generateItineraryPlan
};
