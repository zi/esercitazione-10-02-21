////////////
const toast = document.querySelector(".toast");
const iconLog = document.querySelector("#iconUser");
const btnSxSlideShow = document.querySelector(".slideShow__btn-left");
const btnDxSlideShow = document.querySelector(".slideShow__btn-right");

//
const carouselsWrap = document.querySelector(".carousel__wrap");
let slideIndex = 1;

const state = {
  config: {
    API_KEY: "96955e05c8cd883a41ebd094bbab5d81",
    BASE_URL: "https://api.themoviedb.org/3/",
    images: null,
  },
};

//utility per calcolare in automatico il path
function getURL(path) {
  //https://api.themoviedb.org/3/movie/550?api_key=96955e05c8cd883a41ebd094bbab5d81
  return `${state.config.BASE_URL}${path}?api_key=${state.config.API_KEY}`;
}

//utility per le chiamate fetch
async function getData(url) {
  try {
    const result = await fetch(url);
    const data = await result.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

function getImageUrl(imgPath) {
  // const { secure_base_url, backdrop_sizes } = state.config.images

  const secure_base_url = state.config.images.secure_base_url;
  const poster_sizes = state.config.images.poster_sizes;

  return `${secure_base_url}${poster_sizes[2]}${imgPath}`;
}

async function getConfiguration() {
  const configurationUrl = getURL("configuration");

  const result = await getData(configurationUrl);
  console.log(result);
  // aggiorniamo il nostro state interno con i dati ricevuti
  state.config.images = result.images;
  console.log("images", state.config.images);

  return result;
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.toggle("toast__is-hidden");

  setTimeout(() => {
    toast.classList.toggle("toast__is-hidden");
  }, 4000);
}

// ottengo il guestSessionID
async function getSessionID() {
  const pathSessionGuest = "/authentication/guest_session/new";
  const sessionGuestURL = getURL(pathSessionGuest);
  const data = await getData(sessionGuestURL);
  //   console.log(data);
  return data;
}

async function handleSessionData() {
  const sessionData = localStorage.getItem("movieDBSession");
  if (!sessionData) {
    const newSession = await getSessionID();
    if (newSession) {
      const conversionNewSession = JSON.stringify(newSession);
      localStorage.setItem("movieDBSession", conversionNewSession);
      //showToast("Hai eseguito l'accesso come Guest!");
      return true;
    }
    return false;
  } else {
    //controllo che sia ancora valida
    const parseSessionData = JSON.parse(sessionData);
    const dataCurrent = new Date().getTime; // restituisce il numero di ms trascorsi a partire dal 1/1/70
    const expiresData = new Date(parseSessionData.expires_at).getTime();
    if (expiresData < dataCurrent) {
      localStorage.removeItem("movieDBSession");
      await handleSessionData();
      return true;
    }
    return true;
  }
}

async function getPopularMovies() {
  const path = "movie/popular";
  const popularMoviesURL = getURL(path);
  const popularMovies = await getData(popularMoviesURL);
  state.popularMovies = popularMovies.results;
  console.log(state.popularMovies);
  return popularMovies;
}

async function getTopRated() {
  const path = "movie/top_rated";
  const topRatedURL = getURL(path);
  const topRated = await getData(topRatedURL);
  state.topRated = topRated.results;
  console.log(state.popularMovies);
  return topRated;
}

async function getUpComingMovies() {
  const path = "movie/upcoming";
  const upComingMoviesURL = getURL(path);
  const upComingMovies = await getData(upComingMoviesURL);
  console.log(upComingMovies);
  state.upComingMovies = upComingMovies.results;
  return upComingMovies;
}

async function getDetailsMovies(movieID){
  const path=`movie/${movieID}`;
  const detailsMoviesURL = getURL(path);
  const detailsMovies = await getData(detailsMoviesURL);
  console.log(detailsMovies);
  state.detailsMovies = detailsMovies.results;
  return detailsMovies;

}

async function getPopularTV() {
  const path = "tv/popular";
  const popularTvURL = getURL(path);
  const popularTv = await getData(popularTvURL);
  console.log(popularTv);
  state.popularTv = popularTv.results;
  return popularTv;
}

async function getOnTheAirTV() {
  const path = "tv/on_the_air";
  const onTheAirTvURL = getURL(path);
  const onTheAirTv = await getData(onTheAirTvURL);
  console.log("on_the_air",onTheAirTv);
  state.onTheAirTv = onTheAirTv.results;
  return onTheAirTvURL;
}
async function getTopRatedTV() {
  const path = "tv/top_rated";
  const topRatedTvURL = getURL(path);
  const topRatedTv = await getData(topRatedTvURL);
  console.log(topRatedTv);
  state.topRatedTv = topRatedTv.results;
  return topRatedTv;
}
function getMovieCard(imgURL, title, vote) {
  const cardWrap = document.createElement("div");
  const coverImg = document.createElement("img");

  const textWrap = document.createElement("div");
  const text = document.createElement("h3");

  const voteMovie = document.createElement("h5");
  voteMovie.textContent = vote;
  voteMovie.classList.add("carousel__wrap--card-vote");

  cardWrap.classList.add("card");
  textWrap.classList.add("card__title_wrap");

  text.textContent = title;
  coverImg.src = imgURL;

  textWrap.appendChild(text);
  cardWrap.append(coverImg, textWrap, voteMovie);

  return cardWrap;
}

function renderCarousel(divWrap, list) {
  list.forEach((movie) => {
    let card;
    if (movie.title) {
      card = getMovieCard(
        getImageUrl(movie.poster_path),
        movie.title,
        parseFloat(movie.vote_average).toFixed(1)
      );
    } else {
      card = getMovieCard(
        getImageUrl(movie.poster_path),
        movie.name,
        parseFloat(movie.vote_average).toFixed(1)
      );
    }

    divWrap.classList.add("carousel__wrap--popular-movie");
    divWrap.appendChild(card);
  });
}

//creai il wrap per le card
function getWrap(text, titleCarousel) {
  const divWrap = document.createElement("div");
  divWrap.id = `#${text}`;
  const titleCategory = document.createElement("h4");
  titleCategory.textContent = titleCarousel;
  divWrap.classList.add("carousel__wrap--card");
  carouselsWrap.appendChild(titleCategory);
  carouselsWrap.appendChild(divWrap);
  return divWrap;
}

//start
function handleHTMLMounted() {
  Promise.all([
    handleSessionData(),
    getConfiguration(),
    getPopularMovies(),
    getTopRated(),
    getUpComingMovies(),
    getPopularTV(),
    getTopRatedTV(),
    getOnTheAirTV(),
  ]).then(() => {
    showDivs(slideIndex);
    const WrapPopularMovies = getWrap("popular-movies", "Popular Movies");
    const WrapTopRated = getWrap("top-rated", "Top Rated Movies");
    const WrapUpComingMovies = getWrap("upComing", "UpComing Movies");
    const WrapPopolarTV = getWrap("popolarTV", "Popular Series");
    const WrapTopRatedTV = getWrap("TopRatedTV", "Top Rated Series");
    const WrapOnTheAirTV = getWrap("getOnTheAirTV", "On the Air Series"); 

    renderCarousel(WrapPopularMovies, state.popularMovies);
    renderCarousel(WrapTopRated, state.topRated);
    renderCarousel(WrapUpComingMovies, state.upComingMovies);
    renderCarousel(WrapPopolarTV, state.popularTv);
    renderCarousel(WrapTopRatedTV, state.topRatedTv);
    renderCarousel(WrapOnTheAirTV, state.onTheAirTv);
  });
}

/**slideShow***/
function plusDivs(n) {
  showDivs((slideIndex += n));
}

function showDivs(n) {
  let i;
  let x = document.getElementsByClassName("mySlides");
  if (n > x.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = x.length;
  }
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex - 1].style.display = "block";
}
/**end slideShow****/

/**EVENT**/
document.addEventListener("DOMContentLoaded", handleHTMLMounted, {
  once: true,
});

iconLog.addEventListener("click", () => {
  showToast("Hai eseguito l'accesso come Guest!");
});

btnSxSlideShow.addEventListener("click", () => {
  plusDivs(-1);
});

btnDxSlideShow.addEventListener("click", () => {
  plusDivs(+1);
});
