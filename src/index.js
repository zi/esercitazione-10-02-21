const main = document.querySelector("main");

const btnCookie = document.createElement("button");
const bannerCookie = document.querySelector("#banner_cookie");

const list = document.querySelector(".list");
const TopRatedMoviesWrapper = document.querySelector(".topRated_movies");
const popularMoviesWrapper = document.querySelector(".popular_movies");
const popularTvShows = document.querySelector(".popular_tvshows");

// Utility //
const state = {
  config: {
    api_key: "8261c55d99c0ef2de66816edb6f3d86a",
    base_url: "https://api.themoviedb.org/3/",
    img: null,
  },
  movies: {
    top_rated: null,
    popular: null,
  },
  tvShows: {
    popular: null,
  },
};

function getUrl(path) {
  const { api_key, base_url } = state.config;
  return `${base_url}${path}?api_key=${api_key}`;
}

function getImg(imgPath) {
  const { secure_base_url, poster_sizes } = state.config.img;
  return `${secure_base_url}${poster_sizes[1]}${imgPath}`;
}

async function getData(link) {
  try {
    const response = await fetch(link);
    const result = await response.json();

    if (!response.ok) {
      throw result;
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}

// cookie //
function cookie() {
  const cookie = localStorage.getItem("cookie");

  if (!cookie) {
    const bannerCookie = document.querySelector("#banner_cookie");
    const textCookie = document.createElement("p");
    bannerCookie.classList.add("banner_cookie");
    textCookie.classList.add("text_cookie");
    btnCookie.classList.add("btn_cookie");
    textCookie.innerText = `Utilizziamo i cookies per una migliore esperienza su TMDb. Continuando ad utilizzare TMDB si
    accettano i termini della nostra cookie policy.`;
    btnCookie.textContent = `OK`;
    bannerCookie.append(textCookie, btnCookie);

    btnCookie.addEventListener("click", (e) => {
      localStorage.setItem("cookie", "ok");
      main.removeChild(bannerCookie);
    });
  }
}

// getData //
async function getTempSession() {
  const tempSession = getUrl("authentication/guest_session/new");
  const result = await getData(tempSession);
  return result;
}

async function checkGuestSession() {
  const sessionData = localStorage.getItem("mdb_session");

  if (!sessionData) {
    const newSession = await getTempSession();

    if (newSession) {
      const sessionString = JSON.stringify(newSession);
      localStorage.setItem("mdb_session", sessionString);

      return true;
    }
    return false;
  } else {
    const parsedSession = JSON.parse(sessionData);
    const expire = new Date(parsedSession.expires_at).getTime();
    const date = new Date().getTime();

    if (expire < date) {
      localStorage.removeItem("mdb_session");
      await checkGuestSession();

      return true;
    }
    return true;
  }
}

async function getConfig() {
  const configuration = getUrl("configuration");
  const result = await getData(configuration);
  state.config.img = result.images;
  return result;
}

async function getTopRatedMovies() {
  const topRatedMovies = getUrl("movie/top_rated");
  const result = await getData(topRatedMovies);
  state.movies.top_rated = result.results;
  return result;
}

async function getPopularMovies() {
  const popularMovies = getUrl("movie/popular");
  const result = await getData(popularMovies);
  state.movies.popular = result.results;
  return result;
}

async function getPopularTVShows() {
  const popularTVShows = getUrl("tv/popular");
  const result = await getData(popularTVShows);
  state.tvShows.popular = result.results;
  return result;
}

// Base //
function getCard(img, title, text) {
  const cardBody = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardTextWrapper = document.createElement("div");
  const cardTitle = document.createElement("h3");
  const cardText = document.createElement("p");

  cardTitle.textContent = title;
  cardText.textContent = text;
  cardImg.src = img;

  cardBody.classList.add("card_body");
  cardTextWrapper.classList.add("card_textWrapper");
  cardTitle.classList.add("card_title");
  cardText.classList.add("card_text");

  cardTextWrapper.append(cardTitle, cardText);
  cardBody.append(cardImg, cardTextWrapper);

  return cardBody;
}

// Render //

function renderCard() {
  state.movies.top_rated.forEach((element) => {
    const imgPath = getImg(element.poster_path);
    const card = getCard(imgPath, element.title, element.overview);
    TopRatedMoviesWrapper.appendChild(card);
  });

  state.movies.popular.forEach((element) => {
    const imgPath = getImg(element.poster_path);
    const card = getCard(imgPath, element.title, element.overview);
    popularMoviesWrapper.appendChild(card);
  });

  state.tvShows.popular.forEach((element) => {
    const imgPath = getImg(element.poster_path);
    const card = getCard(imgPath, element.name, element.overview);
    popularTvShows.appendChild(card);
  });
}

// content //
function content() {
  Promise.all([
    getTempSession(),
    checkGuestSession(),
    getConfig(),
    getTopRatedMovies(),
    getPopularMovies(),
    getPopularTVShows(),
  ]).then(() => {
    console.log(state);
    renderCard();
    cookie();
  });
}
document.addEventListener("DOMContentLoaded", content, { once: true });
