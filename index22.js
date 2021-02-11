const TOAST = document.querySelector(".toast");
const POPULAR_MOVIES = document.querySelector("#popularMovies");
const TOP_RATED = document.querySelector("#topRatedMovies");
const TV_SEASONS = document.querySelector("#popularTvSeasons");

const state = {
  config: {
    api_key: "60d7451b1581e5b4aac4d99dab019a1a",
    base_url: "https://api.themoviedb.org/3",
    images: null
  },
  pop_movies: null,
  top_rated: null,
  tv_seasons: null,
};


/**
 * Utilities
 */

// mi creo la mia url dinamica
function getUrl(pathName) {

  const { api_key, base_url } = state.config;

  return `${base_url}${pathName}?api_key=${api_key}`;
}

// creo la url da cui andare a prendere l'immagine 
function getImageUrl(imgPath) {

  const secure_base_url = state.config.images.secure_base_url;
  const backdrop_sizes = state.config.images.backdrop_sizes;
  // per verificare dove stanno le chiavi   ->  console.log(state.config.images)

  return `${secure_base_url}${backdrop_sizes[0]}${imgPath}`;
}

// snippet più volte ripetuto, le accorpo in una funzione 
async function getData(url) {

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      throw result;
    }
    return result;
  } catch (errorMessage) {
    console.log(errorMessage);
  }
}

// async function getGuestSession() {
//   const guestSessionUrl = getUrl("/authentication/guest_session/new");

//   const result = await getData(guestSessionUrl);

//   return result;
// }

/**
 * ottiene i dati di configurazione
 *
 * @link https://developers.themoviedb.org/3/configuration/get-api-configuration
 */
async function getConfiguration() {
  const configurationUrl = getUrl("/configuration");

  const result = await getData(configurationUrl);

  state.config.images = result.images;

  return result;
}

// chiamata ai film popolari
async function getPopularMovies() {
  const popularMoviesURL = getUrl("/movie/popular");

  const result = await getData(popularMoviesURL);

  state.movies = result.results;

  return result;
}

// chiamata ai film più votati
async function getTopRated() {
  const topRatedURL = getUrl("/movie/top_rated");

  const result = await getData(topRatedURL);

  state.top_rated = result.results;

  return result;
}

// chiamata alla serie tv
async function getTvSeasons() {
  const popularSeries = getUrl("/tv/popular");

  const result = await getData(popularSeries);

  state.tv_seasons = result.results;

  return result;
}

// creo la card per i film
function getMovieCard(imgUrl, title) {
  const cardWrap = document.createElement("div");             // contenitore intera card
  const coverImg = document.createElement("img");             // contenitore immagine 

  const textWrap = document.createElement("div");             // div sovrapposto all'img con il suo contenuto
  const text = document.createElement("h3");

  cardWrap.classList.add("card");
  textWrap.classList.add("card__title_wrap");

  coverImg.src = imgUrl;
  text.textContent = title;

  textWrap.appendChild(text);
  cardWrap.append(coverImg, textWrap);

  return cardWrap;
}

/**
 * genera le card per i film presenti nel parametro "list"
 * e li appende dentro il nodo parent passato come secondo parametro
 * "sectionNode"
 */
function renderCarousel(list, sectionNode) {
  list.forEach((item) => {
    // ottiene la url dell'immagine completa
    const imgUrl = getImageUrl(item.backdrop_path);

    const movieCard = getMovieCard(imgUrl, item.title || item.name);

    sectionNode.appendChild(movieCard);
  });
}

/**
 * funzione che ottiene i dati dall'esterno,
 * e quando li ha ottenuti renderizza il carosello dei film popolari
 */
function handleHTMLMounted() {
  Promise.all([getConfiguration(), getPopularMovies(), getTopRated(), getTvSeasons()])
  .then(() => {
      // ci permette di lavorare con i dati ottenuti dall'esterno
      renderCarousel(state.movies, POPULAR_MOVIES);
      renderCarousel(state.top_rated, TOP_RATED);
      renderCarousel(state.tv_seasons, TV_SEASONS);
    }
  );
}

document.addEventListener("DOMContentLoaded", handleHTMLMounted, {once: true});


// un pò di pazienza e faccio anche gli opzionali - FORSE