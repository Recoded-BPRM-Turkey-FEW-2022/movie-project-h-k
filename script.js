'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");





// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
  navBar(movies)
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
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};


// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {

    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title
      } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path
    }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date
    }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};



const genresArraylist = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]



//Hasan: code for the nav bar 

const navBar = (movies) => {

  // ** Genre Section 
  //Hasan: seperating movies by genre 
  const genresMovieslist = [];
  for (let genre of genresArraylist) {

    const moviesPerGenre = movies.results.filter((movie) => {
      for (let obj of movie.genre_ids) {
        if (obj === genre.id) {
          return movie
        }
      }
    })
    genresMovieslist.push({ name: genre.name, movies: moviesPerGenre });
  }


  //Hasan: adding all genres as dropdown menu item if no movies match no drop-menu-item shows
  const dropMenuGenres = document.getElementById("dropdown-menu genres")
  for (let genre of genresMovieslist) {
    if (genre.movies.length > 0) {
      dropMenuGenres.innerHTML += `<li><a class="dropdown-item genres" href="#">${genre.name}</a></li>`
    }
  }

  //Hasan: adding event listners to all dropdown menu and render the movies by clicked genre
  const dropItems = document.getElementsByClassName("dropdown-item genres");
  for (let i = 0; i < dropItems.length; i++) {

    dropItems[i].addEventListener('click', () => {
      document.getElementById("container").innerHTML = "";
      const clickedGenreMovies = genresMovieslist.filter(obj => obj.name === dropItems[i].textContent)
      renderMovies(clickedGenreMovies[0].movies);

    });
  }


  // Filter Section 

  console.log(movies.results)

  // const dropMenuGenres = document.getElementById("dropdown-menu filter")
  // for (let genre of genresMovieslist) {
  //   if (genre.movies.length > 0) {
  //     dropMenuGenres.innerHTML += `<li><a class="dropdown-item genres" href="#">${genre.name}</a></li>`
  //   }
  // }





}




document.addEventListener("DOMContentLoaded", autorun);





