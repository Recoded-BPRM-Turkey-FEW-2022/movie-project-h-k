"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieActorsRes = await fetchMovieActors(movie.id); // assigning a variable to the function that fetches actors in one movie
  console.log(movieRes);
  console.log(movieActorsRes);
  renderMovie(movieRes);
  renderActorsForSingleMovie(movieActorsRes); // Calling back the renderActorsForSingleMovie function
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  // console.log(url);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  //  console.log(res.json())
  return res.json();
};

// Newly added: This function to fetch actors in one movie
const fetchMovieActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  // console.log(res.json())
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// Newly added: This function for the DOM of the actors section in the single movie page
const renderActorsForSingleMovie = async (actors) => {
  const actorsDiv = document.getElementById("actors");
  for (let i = 0; i < 5; i++) {
    const actorDiv = document.createElement("li");
    const actor = actors.cast[i].name;
    actorDiv.innerHTML = `
    <h5>${actor}</h5> 
    <img src="${PROFILE_BASE_URL + actors.cast[i].profile_path}" alt="${actor} poster">`;
    actorsDiv.appendChild(actorDiv);
  }

  // Newly added: This function for the DOM of the director in the single movie page
  const directorSection = document.getElementById("director");
  for (let j = 0; j <= actors.crew.length; j++) {
    if (actors.crew[j].job === 'Director') {
      const director = document.createElement("p");
      directorSection.innerHTML = `Director: ${actors.crew[j].name}`; 
      directorSection.appendChild(director);
    }
  }
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  const company = movie.production_companies.map((company) => { // Added production companies to the single movie page
    return `<p>${company.name}</p>
    <img id="movie-backdrop" src=${BACKDROP_BASE_URL + company.logo_path}>`;
  });

  const genres = movie.genres.map((genres) => { // Added genres to the single movie page
    return `<p>${genres.name}</p>`;
  });

  const voteAverage = `Average Vote: ${movie.vote_average}`; // Added vote average to the single movie page
  const voteCount = `Vote Count: ${movie.vote_count}`; // Added vote count to the single movie page
  const language = `Language: ${movie.spoken_languages[0].english_name}`; // Added spoken language to the single movie page

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>

            <ul id="genres" class="list-unstyled"> 
              <li>${genres}</li>
            </ul>

            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>

            <div class="single-movie-info">
              <p id="vote-average">${voteAverage}</p>
              <p id="vote-count">${voteCount}</p>
            </div>

            <div class="single-movie-info">
              <p id="director"></p>
              <p id="language">${language}</p>
            </div>

        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>

            <ul id="companies" class="list-unstyled"> 
              <li>${company}</li>
            </ul>

    </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);
