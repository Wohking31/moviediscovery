import React, { useState, useEffect } from 'react';
// Correctly import the movieService object
import { movieService } from './Services/movieService';
import './App.css'; // Optional: for some basic styling

function App() {
  // State to hold the list of popular movies
  const [movies, setMovies] = useState([]);
  
  // State to handle the loading status
  const [loading, setLoading] = useState(true);
  
  // State to hold any potential errors
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Define an async function to fetch the data
    const fetchMovies = async () => {
      try {
        // Set loading to true before the API call
        setLoading(true);
        setError(null); // Clear previous errors

        // Call the getPopularMovies method ON the movieService object
        const data = await movieService.getPopularMovies();
        
        // Update the state with the movie results
        setMovies(data.results);

      } catch (err) {
        // If an error occurs, update the error state
        setError(err.message);
      } finally {
        // Set loading to false after the API call finishes (whether successful or not)
        setLoading(false);
      }
    };

    // Call the function
    fetchMovies();
  }, []); // The empty array [] means this effect runs only once when the component mounts

  // --- Render logic ---

  // 1. Show a loading message
  if (loading) {
    return <div className="app-status"><h1>Loading movies...</h1></div>;
  }

  // 2. Show an error message if something went wrong
  if (error) {
    return <div className="app-status error"><h1>Error: {error}</h1></div>;
  }

  // 3. Display the movies if the fetch was successful
  return (
    <div className="App">
      <header>
        <h1>Popular Movies</h1>
      </header>
      <main className="movie-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
            />
            <h3>{movie.title}</h3>
            <p>Rating: {movie.vote_average}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;