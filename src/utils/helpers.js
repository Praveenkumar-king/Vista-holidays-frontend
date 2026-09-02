/**
 * Utility helper functions for the frontend
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium'
  }).format(new Date(date));
};
