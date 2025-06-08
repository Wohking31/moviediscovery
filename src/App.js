"use client"

import { useState, useEffect } from "react"
// Correctly import the movieService object
import { movieService } from "./Services/movieService"
import "./App.css"

function App() {
  // State to hold the list of popular movies
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])

  // State to handle the loading status
  const [loading, setLoading] = useState(true)

  // State to hold any potential errors
  const [error, setError] = useState(null)

  // Filter states
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState("")
  const [yearRange, setYearRange] = useState({ min: 1900, max: 2030 })
  const [selectedYear, setSelectedYear] = useState("")
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 10 })
  const [selectedRating, setSelectedRating] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [moviesPerPage] = useState(8)

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Define an async function to fetch the data
    const fetchMovies = async () => {
      try {
        // Set loading to true before the API call
        setLoading(true)
        setError(null) // Clear previous errors

        // Call the getPopularMovies method ON the movieService object
        const data = await movieService.getPopularMovies()

        // Update the state with the movie results
        setMovies(data.results)
        setFilteredMovies(data.results)

        // Extract unique genres from the movies
        const allGenreIds = data.results.flatMap((movie) => movie.genre_ids)
        const uniqueGenreIds = [...new Set(allGenreIds)]
        setGenres(uniqueGenreIds)

        // Extract year range
        const years = data.results
          .map((movie) => new Date(movie.release_date).getFullYear())
          .filter((year) => !isNaN(year))

        if (years.length > 0) {
          setYearRange({
            min: Math.min(...years),
            max: Math.max(...years),
          })
        }

        // Extract rating range
        const ratings = data.results.map((movie) => movie.vote_average)
        if (ratings.length > 0) {
          setRatingRange({
            min: Math.floor(Math.min(...ratings)),
            max: Math.ceil(Math.max(...ratings)),
          })
        }
      } catch (err) {
        // If an error occurs, update the error state
        setError(err.message)
      } finally {
        // Set loading to false after the API call finishes (whether successful or not)
        setLoading(false)
      }
    }

    // Call the function
    fetchMovies()
  }, []) // The empty array [] means this effect runs only once when the component mounts

  // Filter movies based on selected filters and search query
  useEffect(() => {
    let result = [...movies]

    // Filter by genre
    if (selectedGenre) {
      result = result.filter((movie) => movie.genre_ids.includes(Number.parseInt(selectedGenre)))
    }

    // Filter by year
    if (selectedYear) {
      result = result.filter((movie) => {
        const movieYear = new Date(movie.release_date).getFullYear()
        return movieYear === Number.parseInt(selectedYear)
      })
    }

    // Filter by rating
    if (selectedRating) {
      const rating = Number.parseInt(selectedRating)
      result = result.filter((movie) => Math.floor(movie.vote_average) === rating)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) || (movie.overview && movie.overview.toLowerCase().includes(query)),
      )
    }

    setFilteredMovies(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [movies, selectedGenre, selectedYear, selectedRating, searchQuery])

  // Get current movies for pagination
  const indexOfLastMovie = currentPage * moviesPerPage
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Reset all filters
  const resetFilters = () => {
    setSelectedGenre("")
    setSelectedYear("")
    setSelectedRating("")
    setSearchQuery("")
  }

  // Generate year options
  const generateYearOptions = () => {
    const years = []
    for (let year = yearRange.max; year >= yearRange.min; year--) {
      years.push(year)
    }
    return years
  }

  // Generate rating options
  const generateRatingOptions = () => {
    const ratings = []
    for (let rating = ratingRange.max; rating >= ratingRange.min; rating--) {
      ratings.push(rating)
    }
    return ratings
  }

  // --- Render logic ---

  // 1. Show a loading message
  if (loading) {
    return (
      <div className="app-status">
        <h1>Loading movies...</h1>
      </div>
    )
  }

  // 2. Show an error message if something went wrong
  if (error) {
    return (
      <div className="app-status error">
        <h1>Error: {error}</h1>
      </div>
    )
  }

  // 3. Display the movies if the fetch was successful
  return (
    <div className="App">
      <header>
        <h1>Popular Movies</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <div className="filters-container">
        <div className="filter">
          <label>Genre:</label>
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="">All Genres</option>
            {genres.map((genreId) => (
              <option key={genreId} value={genreId}>
                {genreId} {/* Ideally, you'd map genre IDs to names */}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">All Years</option>
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Rating:</label>
          <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
            <option value="">All Ratings</option>
            {generateRatingOptions().map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ Stars
              </option>
            ))}
          </select>
        </div>

        <button className="reset-button" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      <main className="movie-grid">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-year">{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</p>
                <div className="movie-rating">
                  <span className="star">★</span>
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No movies found matching your criteria</div>
        )}
      </main>

      {filteredMovies.length > moviesPerPage && (
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-button">
            &laquo; Prev
          </button>

          {Array.from({ length: Math.ceil(filteredMovies.length / moviesPerPage) }).map((_, index) => {
            // Show limited page numbers with ellipsis for better UX
            const pageNum = index + 1
            const showPageNumber =
              pageNum === 1 ||
              pageNum === Math.ceil(filteredMovies.length / moviesPerPage) ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)

            if (showPageNumber) {
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`page-button ${currentPage === pageNum ? "active" : ""}`}
                >
                  {pageNum}
                </button>
              )
            } else if (
              (pageNum === 2 && currentPage > 3) ||
              (pageNum === Math.ceil(filteredMovies.length / moviesPerPage) - 1 &&
                currentPage < Math.ceil(filteredMovies.length / moviesPerPage) - 2)
            ) {
              return (
                <span key={pageNum} className="ellipsis">
                  ...
                </span>
              )
            }
            return null
          })}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredMovies.length / moviesPerPage)}
            className="page-button"
          >
            Next &raquo;
          </button>
        </div>
      )}

      <div className="results-info">
        Showing {indexOfFirstMovie + 1}-{Math.min(indexOfLastMovie, filteredMovies.length)} of {filteredMovies.length}{" "}
        movies
      </div>
    </div>
  )
}

export default App
