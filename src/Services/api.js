import { API_BASE_URL, API_KEY } from '../utils/constants';

/**
 * A generic function to fetch data from the API.
 * It handles URL construction, adding the API key, and basic error handling.
 * @param {string} endpoint - The API endpoint to call (e.g., '/movie/popular').
 * @param {string} [queryString=''] - Optional query parameters (e.g., 'query=Inception').
 * @returns {Promise<any>} - A promise that resolves with the JSON data.
 * @throws {Error} - Throws an error if the network request fails or the API returns an error status.
 */
export const fetchData = async (endpoint, queryString = '') => {
  // Check if the endpoint already has query parameters.
  const separator = endpoint.includes('?') ? '&' : '?';
  
  // Construct the full URL with the base URL, endpoint, and API key.
  const url = `${API_BASE_URL}${endpoint}${separator}api_key=${API_KEY}&${queryString}`;

  try {
    const response = await fetch(url);

    // If the response is not OK (e.g., 404, 500), throw an error.
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || 'Something went wrong');
    }

    // If the response is OK, parse and return the JSON data.
    return await response.json();
  } catch (error) {
    // Re-throw the error to be handled by the calling function.
    console.error(`API fetch error for endpoint [${endpoint}]:`, error);
    throw error;
  }
};