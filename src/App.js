import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // https://swapi.dev/api/films/
      // url db-firebese https://react-movie-http-965c9-default-rtdb.europe-west1.firebasedatabase.app/
      const response = await fetch(
        "https://react-movie-http-965c9-default-rtdb.europe-west1.firebasedatabase.app/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      console.log('data',data);

      const loadedMovies =[]

      for (const key in data){
        loadedMovies.push({
          id:key,
          title: data[key].title,
          releaseDate: data[key].releaseDate,
          openingText: data[key].opening_crawl,

        })
      }
     
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    try {
      const response = await fetch(
        "https://react-movie-http-965c9-default-rtdb.europe-west1.firebasedatabase.app/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers:{
            'Content-Type': 'application/json'
          } 
        }
      );
      if (!response.ok){
        throw new Error('somthing went wrong')
      }
      const data = await response.json()
      console.log(data)
    } catch (error) {
      setError(error)
    }
    
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
