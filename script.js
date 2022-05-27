"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");



//adding style to nav bar 



//styling home page 


// function carousel (){


//   let xPos = 0;
//   gsap.timeline()
//     .set('.ring', { rotationY: 180, cursor: 'grab' }) //set initial rotationY so the parallax jump happens off screen
//     .set('.img', { // apply transform rotations to each image
//       rotateY: (i) => i * -36,
//       transformOrigin: '50% 50% 500px',
//       z: -500,
//       backgroundImage: (i) => 'url(https://picsum.photos/id/' + (i + 32) + '/600/400/)',
//       backgroundPosition: (i) => getBgPos(i),
//       backfaceVisibility: 'hidden'
//     })
//     .from('.img', {
//       duration: 1.5,
//       y: 200,
//       opacity: 0,
//       stagger: 0.1,
//       ease: 'expo'
//     })
//     .add(() => {
//       $('.img').on('mouseenter', (e) => {
//         let current = e.currentTarget;
//         gsap.to('.img', { opacity: (i, t) => (t == current) ? 1 : 0.5, ease: 'power3' })
//       })
//       $('.img').on('mouseleave', (e) => {
//         gsap.to('.img', { opacity: 1, ease: 'power2.inOut' })
//       })
//     }, '-=0.5')

//   $(window).on('mousedown touchstart', dragStart);
//   $(window).on('mouseup touchend', dragEnd);


//   function dragStart(e) {
//     if (e.touches) e.clientX = e.touches[0].clientX;
//     xPos = Math.round(e.clientX);
//     gsap.set('.ring', { cursor: 'grabbing' })
//     $(window).on('mousemove touchmove', drag);
//   }


//   function drag(e) {
//     if (e.touches) e.clientX = e.touches[0].clientX;

//     gsap.to('.ring', {
//       rotationY: '-=' + ((Math.round(e.clientX) - xPos) % 360),
//       onUpdate: () => { gsap.set('.img', { backgroundPosition: (i) => getBgPos(i) }) }
//     });

//     xPos = Math.round(e.clientX);
//   }


//   function dragEnd(e) {
//     $(window).off('mousemove touchmove', drag);
//     gsap.set('.ring', { cursor: 'grab' });
//   }


//   function getBgPos(i) { //returns the background-position string to create parallax movement in each image
//     return (100 - gsap.utils.wrap(0, 360, gsap.getProperty('.ring', 'rotationY') - 180 - i * 36) / 360 * 500) + 'px 0px';
//   }



// }


// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  const upComingMovies = await fetchUpcomingMovies();
  renderMovies(movies.results);
  navBar(movies, upComingMovies)
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
  const movieTrailerRes = await fetchMovieTrailer(movie.id); // assigning a variable to the function that fetches trailer in one movie
  const movieRelatedMoviesRes = await fetchRelatedMovies(movie.id); // assigning a variable to the function that fetches related movies in one movie
  // console.log(movieRes);
  // console.log(movieActorsRes);
  // console.log(movieTrailerRes);
  // console.log(movieRelatedMoviesRes);
  renderMovie(movieRes);
  renderActorsForSingleMovie(movieActorsRes); // Calling back the renderActorsForSingleMovie function
  renderTrailer(movieTrailerRes); // Calling back the renderTrailer function
  renderRelatedMovies(movieRelatedMoviesRes); // Calling back the renderRelatedMovies function
};

// Newly added: For actor details
const actorDetails = async (actorId) => {
  const actorRes = await fetchActor(actorId); // assigning a variable to the function that fetches actor
  const movieOtherMoviesRes = await fetchOtherMovies(actorId); // assigning a variable to the function that fetches other movies for single actor
  // console.log(actorRes);
  // console.log(movieOtherMoviesRes);
  renderActor(actorRes); // Calling back the renderActor function
  renderOtherMovies(movieOtherMoviesRes); // Calling back the renderOtherMovies function
};

// Newly added: For all actors details
const allActorsDetails = async (actors) => {
  const allActorsRes = await fetchAllActors(actors); // assigning a variable to the function that fetches all actors
  renderAllActors(allActorsRes); // Calling back the renderAllActors function
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Newly added: This function is to fetch actors.
const fetchAllActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  //  console.log(res.json())
  return res.json();
};


async function fetchUpcomingMovies() {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  return res.json();

}


// Newly added: This function to fetch actors in one movie
const fetchMovieActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  // console.log(res.json())
  return res.json();
};

// Newly added: This function to fetch trailer in one movie
const fetchMovieTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results)
  return data.results;
};

// Newly added: This function to fetch related movies in one movie
const fetchRelatedMovies = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.results)
  return data.results;
};

// Newly added: This function to fetch actor
const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  return res.json();
};

// Newly added: This function to fetch other movies in single actor page
const fetchOtherMovies = async (actorId) => {
  const url = constructUrl(`person/${actorId}/movie_credits`);
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data.cast)
  return data.cast;
};


// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  console.log(movies)
  movies.map((movie) => {

    const movieDiv = document.createElement("div");
    console.log(movie)
    movieDiv.innerHTML = `
    


    <div class="card mx-3 mt-5" style="width: 17rem ;">
    <img class="card-img-top" id="card-img-top" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" style=" object-fit: cover;">
     <div class="card-body text-center" id = "card-body">
     
       <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">${movie.vote_average}</p>
      </div>
    </div>

`
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// Newly added: This function for the DOM of the actors page
const renderAllActors = (actors) => {
  CONTAINER.innerHTML = ""
  actors.results.map((actor) => {

    const actorDiv = document.createElement("div");
    actorDiv.classList.add("home-page-row");
    actorDiv.innerHTML = `
    <div class="col">
      <div class="card actor-card" style="width: 12rem;">
        <img src="${BACKDROP_BASE_URL + actor.profile_path}" class="card-img-top" alt="${actor.name} poster">
        <div class="card-body">
          <h3 class="card-text">${actor.name}</h3>
        </div>
      </div>
    </div>`;

    actorDiv.addEventListener("click", () => {
      actorDetails(actor.id);
    });
    CONTAINER.appendChild(actorDiv);
  });
};


// Newly added: This function for the DOM of the actors section in the single movie page
const renderActorsForSingleMovie = async (actors) => {
  const actorsDiv = document.getElementById("actors");
  for (let i = 0; i < 5; i++) {
    const actorDiv = document.createElement("div");
    // actorDiv.classList.add('col');
    const actor = actors.cast[i].name;
    actorDiv.innerHTML = `
    <div class="col-lg-3 col-md-4 col-xl-2 card mx-2"  id="actor-${i}" style="width: 12rem ;">
    <img src="${PROFILE_BASE_URL + actors.cast[i].profile_path}" class=" actor-img card-img-top" alt="${actor} poster">
     <div class="card-body text-center" id = "card-body">
        <p class="card-text">${actor}</p>
      </div>
    </div>

     `;

    actorDiv.addEventListener("click", () => {
      actorDetails(actors.cast[i].id);
    });
    actorsDiv.appendChild(actorDiv);
  }

  // Newly added: This function for the DOM of the director in the single movie page
  const directorSection = document.getElementById("director");
  for (let j = 0; j <= actors.crew.length; j++) {
    if (actors.crew[j]?.job == "Director") {
      const director = document.createElement("p");
      directorSection.innerHTML = `Director: ${actors.crew[j].name}`;
      directorSection.appendChild(director);
    }
  }
};

// Newly added: This function for the DOM of the trailer section in the single movie page
const renderTrailer = async (trailer) => {
  const TrailerDiv = document.getElementById("trailer");
  for (let i = 0; i <= trailer.length; i++) {
    if (trailer[i]?.type === "Trailer") {
      const trailerData = trailer[i].key;
      TrailerDiv.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${trailerData}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  }
};

// Newly added: This function for the DOM of the related movies section in the single movie page
const renderRelatedMovies = async (relatedMovies) => {
  const relatedMoviesDiv = document.getElementById("related-movies");
  for (let i = 0; i < 5; i++) {
    const relatedMovieDiv = document.createElement("div");
    const relatedMovie = relatedMovies[i].title;
    relatedMovieDiv.innerHTML = `
      <div class="col-lg-3 col-md-4 col-xl-2 card mx-2" id="relatedMovie" style="width: 12rem;">
        <img src="${BACKDROP_BASE_URL + relatedMovies[i].poster_path}" class="card-img-top" alt="${relatedMovie} poster">
        <div class="card-body text-center pt-1 " style="height: 5rem;">
          <p class="card-text">${relatedMovie}</p>
        </div>
      </div>
    `;
    relatedMoviesDiv.appendChild(relatedMovieDiv);
  }
};


// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {

  const company = movie.production_companies.map((company) => {
    console.log(company.logo_path)
    // Added production companies to the single movie page


    return `
    <div class="col-lg-3 col-md-4 col-xl-2 card mx-2" style="width: 12rem; margin: 2px" >
      <img id="movie-backdrop" class="card-img-top" src=${company.logo_path === null ? "/images/not_found_image.jpg" : BACKDROP_BASE_URL + company.logo_path}>
      <div class="card-body text-center">
        <p class="card-text">${company.name}</p>
      </div>
    </div>
    `;
  });

  const genres = movie.genres.map((genres) => {
    // Added genres to the single movie page
    return `<p>${genres.name}</p>`;
  });

  const voteAverage = `Average Vote: ${movie.vote_average}`; // Added vote average to the single movie page
  const voteCount = `Vote Count: ${movie.vote_count}`; // Added vote count to the single movie page
  const language = `Language: ${movie.spoken_languages[0].english_name}`; // Added spoken language to the single movie page

  CONTAINER.innerHTML = `

    
    <div id="first-part">
      <div id="image_movie_div">
        <div class="shadow_effect"></div>
          <img id="movie-backdrop" class="single_movie_img" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        </div>
        <div class="short_info">
          <h2 id="movie-title"><span>${movie.title}</span></h2>

          <ul id="genres" class="list-unstyled"> 
            <li>${genres.join("")}</li>
          </ul>
          
          <div class="more_info">
            <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
          </div>

          <h5>Overview:</h5>
          <p id="movie-overview">${movie.overview}</p>

          <div class="more_info">
            <p id="vote-average">${voteAverage}</p>
            <p id="vote-count">${voteCount}</p>
          </div>

          <div class="more_info">
            <p id="director"></p>
            <p id="language">${language}</p>
          </div>

        </div>

        <div id="second-part">
          <div class="row mb-5 h-100" >
            <div class = "col-12 h-25">
              <div class = "h3 my-3  " id="actor-header">Actors:</div>
            </div>
            <div class = " d-flex flex-wrap  h-75 w-100  " id="actors" ></div>
          </div>



          <div class="row" id="production-company">
            <div class = "h3 col-12 mb-3"id="production-header">Production Companies:</div>
            <div id="companies" class= "d-flex flex-wrap  h-75 w-100 mb-3"> 
              ${company.join("")}
            </div>
          </div>

          <div class="row" >
              <div class = "h3 col-12 mb-3 text-white">Trailer:</div>
            <div id="trailer"></div>
          </div>

          <div class="row">
            <div class = "h3 col-12 mt-5 text-danger">Related Movies:</div>
            <div id="related-movies" class="d-flex flex-wrap  h-75 w-100 mb-3"></div>
          </div>

        </div>

    </div>`;
};

// Newly added: For the single actor page
const renderActor = (actor) => {

  const actorGender = `Gender: ${actor.gender}`; // Added actor's gender to the actor page
  const actorPopularity = `Popularity: ${actor.popularity}`; // Added actor's popularity to the actor page
  const actorBirthday = `Birthday: ${actor.birthday}`; // Added actor's birthday to the actor page
  const actorDeathday = `Deathday: ${actor.deathday}`; // Added actor's deathday to the actor page
  const actorBiography = `Deathday: ${actor.biography}`; // Added actor's biography to the actor page

  CONTAINER.innerHTML = `
    <div class="row my-5 " id="single-actor-page">
      <div class="col-lg-4 col-md-4 col-sm-4 col-5 ">
      <img id="actor-backdrop" src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.name} poster">
      </div>
      <div class="col-lg-8 col-md-8 col-sm-12">
        <div class ="h2 text-white" id="actor-name"><span>${actor.name}</span></div>


        <div class = "h4 text-white"></div>
        <div class = "h4 text-white" id="popularity">${actorPopularity}</div>

        
        <div class="h4 text-white" id="birthday">${actorBirthday}</div>
        ${actor.deathday !== "null" ? '' : actorDeathday}

        <div class="h4  text-white">Biography</div>
        <p id="biography" style="color:#BDBDBD; font-size: .8rem;">${actorBiography}</p>
      </div>

      <div class="row  h-100">
        <div class = "h3 col-12 my-5 text-danger">Also starring in :</div>
        <div id="other-movies" class="d-flex flex-wrap  h-75 w-100  ">
          
        </div>
      </div>

    </div>`;
};

// Newly added: This function for the DOM of the other related movies section in the single actor page
const renderOtherMovies = async (otherMovies) => {
  const otherMoviesDiv = document.getElementById("other-movies");
  for (let i = 0; i < 5; i++) {
    const otherMovieDiv = document.createElement("div");
    const otherMovie = otherMovies[i].title;
    otherMovieDiv.innerHTML = `

      <div class="card col-lg-3 col-md-4 col-xl-2 card mx-2" style="width: 9rem;">
        <img src="${BACKDROP_BASE_URL + otherMovies[i].poster_path}" class="card-img-top" alt="${otherMovie} poster">
        <div class="card-body">
          <p class="card-text">${otherMovie}</p>
        </div>
      </div>
  
    `;

    otherMovieDiv.addEventListener("click", () => {
      console.log(otherMovies[i].id)
      movieDetails(otherMovies[i]);
    });
    otherMoviesDiv.appendChild(otherMovieDiv);
  }
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














const navBar = (movies, upComingMovies) => {

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


  function calculateAverage(array) {
    var total = 0;
    var count = 0;

    array.forEach(function (item, index) {
      total += item;
      count++;
    });

    return total / count;
  }



  const popular = document.getElementById("Popular")
  const releaseDate = document.getElementById("Release Date")
  const topRated = document.getElementById("Top Rated")
  const nowPlaying = document.getElementById("now playing")
  const upComing = document.getElementById("Up Coming")

  const filterList = [popular, releaseDate, topRated, nowPlaying, upComing]


  console.log(movies.results);

  for (let i = 0; i < filterList.length; i++) {

    filterList[i].addEventListener('click', () => {

      if (filterList[i].textContent === "Popular") {
        const popularityIndexArray = [];
        for (let i of movies.results) {
          popularityIndexArray.push(i.popularity)
        }
        const averagePopularity = calculateAverage(popularityIndexArray);
        const popularMovies = movies.results.filter(movie => movie.popularity >= averagePopularity)
        document.getElementById("container").innerHTML = "";
        renderMovies(popularMovies)
      }

      else if (filterList[i].textContent === "Release Date") {
        console.log("hello")
        const releaseDateArray = [...movies.results]
        releaseDateArray.sort((a, b) => (a.release_date < b.release_date) ? 1 : ((b.release_date < a.release_date) ? -1 : 0))
        document.getElementById("container").innerHTML = "";
        renderMovies(releaseDateArray);
      }
      else if (filterList[i].textContent === "Top Rated") {
        const votingIndex = [];
        for (let i of movies.results) {
          votingIndex.push(i.vote_average)
        }
        const averageVoting = calculateAverage(votingIndex);
        const highVotedMovies = movies.results.filter(movie => movie.vote_average >= averageVoting)
        document.getElementById("container").innerHTML = "";
        renderMovies(highVotedMovies)
      }
      else if (filterList[i].textContent === "now playing") {

        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        console.log(typeof date)
        const nowPlayingMovies = movies.results.filter(movie => movie.release_date <= date)
        console.log(nowPlayingMovies)
      }
      else if (filterList[i].textContent === "Up Coming") {
        document.getElementById("container").innerHTML = "";
        renderMovies(upComingMovies.results)
      }

    });
  }


  // About Us section 
  const aboutUs = document.getElementById("about us")
  // console.log(aboutUs)
  aboutUs.addEventListener("click", () => {

    document.getElementById("container").innerHTML = "";
    CONTAINER.innerHTML =
      `
    <div class="row d-flex flex-column align-items-center justify-content-center">
    <div class="col-12">
        <img src="https://i.ytimg.com/vi/iAYmjA9LHIc/maxresdefault.jpg" alt="">
    </div>
    <div class="col-5 text-white text-center mt-5">
        We are Pirate Developers. Looking for expanding towards Higher Amplitude and Dimnsion
        We present our Fine Creations with Humble and Attitude to surpass the living Creatures beyond its
        limits
        Share and Give us your never ending Love by following us on platforms:
    </div>
    <div class="col">
        <div class="text-center my-4">
            <a href="https://www.linkedin.com/in/kinan-hatahet/" target="_blank">Kinan
                X</a><a href="https://www.linkedin.com/in/hasanshka/" target="_blank"> Hasan</a>
        </div>
    </div>

</div>
    
    `

  })








}

const actorsNav = document.getElementById('actors-nav');
actorsNav.addEventListener("click", function () { // adding  event listener to actors in navbar
  allActorsDetails()
});


document.addEventListener("DOMContentLoaded", autorun);





