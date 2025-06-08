import { fetchData } from './api';

/**
 * This object contains all the functions to interact with the movie-related API endpoints.
 */
export const movieService = {
  /**
   * Fetches the list of popular movies.
   * Corresponds to: GET /movie/popular
   */
  getPopularMovies: () => {
    return fetchData('/movie/popular');
  },

  /**
   * Searches for movies based on a query term.
   * @param {string} searchTerm - The term to search for.
   * Corresponds to: GET /search/movie?query={search_term}
   */
  searchMovies: (searchTerm) => {
    // The endpoint itself is `/search/movie`, and the query string is passed separately.
    return fetchData('/search/movie', `query=${encodeURIComponent(searchTerm)}`);
  },

  /**
   * Fetches the detailed information for a specific movie.
   * @param {number|string} movieId - The ID of the movie.
   * Corresponds to: GET /movie/{movie_id}
   */
  getMovieDetails: (movieId) => {
    return fetchData(`/movie/${movieId}`);
  },

  /**
   * Fetches the list of all official movie genres.
   * Corresponds to: GET /genre/movie/list
   */
  getMovieGenres: () => {
    return fetchData('/genre/movie/list');
  },

  /**
   * Fetches a list of movies similar to a specific movie.
   * @param {number|string} movieId - The ID of the movie to find similar ones for.
   * Corresponds to: GET /movie/{movie_id}/similar
   */
  getSimilarMovies: (movieId) => {
    return fetchData(`/movie/${movieId}/similar`);
  },
};