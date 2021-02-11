const TOAST = document.querySelector(".toast");
const POPULAR_MOVIES = document.querySelector("#popularMovies");
const TOP_RATED_MOVIES = document.querySelector("#topRatedMovies");
const POP_TV_SERIES = document.querySelector("#popTvSeries");

const state = {
  config: {
    api_key: "212bebc18fae983c3fa75b9ecd381c54",
    base_url: "https://api.themoviedb.org/3",
    images: null
  },
  movies: {
    popular: null,
    topRated: null
  },
  tvSeries: {
    popular: null
  }
};

/**
 * Utilities
 */
function getUrl(pathName) {
  const { api_key, base_url } = state.config;

  return `${base_url}${pathName}?api_key=${api_key}`;
}

function getImageUrl(imgPath) {
  // const { secure_base_url, backdrop_sizes } = state.config.images

  const secure_base_url = state.config.images.secure_base_url;
  const backdrop_sizes = state.config.images.backdrop_sizes;

  return `${secure_base_url}${backdrop_sizes[0]}${imgPath}`;
}

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

 /* crea un guest session id 

 */
async function getGuestSession() {
  const guestSessionUrl = getUrl("/authentication/guest_session/new");

  const result = await getData(guestSessionUrl);

  return result;
}

/**
 * ottiene i dati di configurazione
 */
async function getConfiguration() {
  const configurationUrl = getUrl("/configuration");

  const result = await getData(configurationUrl);

  state.config.images = result.images;

  return result;
}

/**
 * ottiene i la lista di film più popolari
 */
async function getPopularMovies() {
  const popularMoviesURL = getUrl("/movie/popular");

  const rawResponse = await getData(popularMoviesURL);

  state.movies.popular = rawResponse.results;

  return rawResponse;
}

/**
 * gestisce la sessione guest dell'utente
 */
async function handleSession() {
  // ottiene il dato da localStorage
  const sessionData = localStorage.getItem("mdb_session");

  // se sessionData è undefined
  if (!sessionData) {
    // crea una nuova sessione
    const newSessionData = await getGuestSession();

    // se la chiamata getGuestSession ritorna un valore
    if (newSessionData) {
      // trasforma in stringa l'oggetto (localStorage può avere solo stringhe)
      const sessionDataString = JSON.stringify(newSessionData);

      // aggiunge il valore nel localStorage
      localStorage.setItem("mdb_session", sessionDataString);

      // mostra il toastBaner per dare un feedback all'utente
      showToast("Hey! Adesso sei registrato come guest");

      return true;
    }

    return false;
  } else {
    // se sessionData ha un valore

    // trasforma la stringa ottenuta da localSotarge in oggetto o variabile primitiva
    const parsedSessionData = JSON.parse(sessionData);

    const expiresDate = new Date(parsedSessionData.expires_at).getTime();
    const nowDate = new Date().getTime();

    // se expiresDate in millisecondi è inferiore
    // a nowDate in millisecondi allora la sessione è scaduta
    if (expiresDate < nowDate) {
      // rimuoviamo i dati della sessione del localStorage
      localStorage.removeItem("mdb_session");

      // chiamiamo la funzione stessa per gestire la
      // creazione di una nuova sessione e l'inserimento nel localStorage
      await handleSession();

      return true;
    }
    return true;
  }
}

/**
 * Mostra il toast banner per 4s con il messaggio
 * che gli viene passato come parametro
 */
function showToast(text) {
  TOAST.textContent = text;
  TOAST.classList.toggle("toast__is-hidden");

  setTimeout(() => {
    TOAST.classList.toggle("toast__is-hidden");
  }, 4000);
}

function overlayOnMovie(evt){
  const card = evt.currentTarget;
  document.querySelector("#overlay").style.display = "block"; 
  const infoMovies = getInfoMovie(card.getAttribute('data-id'));
  console.log(card.getAttribute('data-id'))
  console.log(infoMovies)
} 
                                                                    //esercizio 3 da completare//
function overlayOnSeries(evt){
  const card = evt.currentTarget;
  document.querySelector("#overlay").style.display = "block"; 
  const infoSeries = getInfoSeries(card.getAttribute('data-id'));
  console.log(infoSeries)
}

//fetch per info movie//
async function getInfoMovie(movie_id){

  const getMovieUrl = getUrl(`/movie/${movie_id}`);

  const result = await getData(getMovieUrl);
   
  return result;
}

//fetch per info series//
async function getInfoSeries(tv_id){

  const getSeriesUrl = getUrl(`/tv/${tv_id}`);

  const result = await getData(getSeriesUrl);
   
  return result;
}


/**
 * Crea una card per i film / serie tv
 */
function getCard(imgURL, title, id, isMovie) {
  const cardWrap = document.createElement("div");
  const coverImg = document.createElement("img");

  const textWrap = document.createElement("div");
  const text = document.createElement("h3");

  cardWrap.classList.add("card");
  textWrap.classList.add("card__title_wrap");

  text.textContent = title;
  coverImg.src = imgURL;

  textWrap.appendChild(text);
  cardWrap.append(coverImg, textWrap);

  cardWrap.dataset.id = id;       //id (film o serie) ad ogni card//
  if(isMovie){ 
    cardWrap.addEventListener('click', overlayOnMovie); 
  } else {
    cardWrap.addEventListener('click', overlayOnSeries);
  }
  return cardWrap;
}

/**
 * genera le card per i film presenti nel parametro "list"
 * e li appende dentro il nodo parent passato come secondo parametro
 * "sectionNode"
 */
function renderCarousel(list, sectionNode, isMovie) {
  list.forEach((item) => {
    // ottiene la url dell'immagine completa
    const imgURL = getImageUrl(item.backdrop_path); 

    const card = isMovie ? getCard(imgURL, item.title, item.id, isMovie):getCard(imgURL, item.name, item.id, isMovie);

    sectionNode.appendChild(card);
  });
}

/**
 * funzione che ottiene i dati dall'eseterno,
 * e quando li ha ottenuti renderizza il carosello dei film popolari
 */
function handleHTMLMounted() {
  Promise.all([handleSession(), getConfiguration(), getPopularMovies(), getTopRatedMovies(), getPopTvSeries()]).then(
    () => {
      // ci permette di lavorare con i dati ottenuti dall'esterno
      renderCarousel(state.movies.popular, POPULAR_MOVIES, true);
      renderCarousel(state.movies.topRated, TOP_RATED_MOVIES, true);
      renderCarousel(state.tvSeries.popular, POP_TV_SERIES, false);
    }
  );
}

async function getTopRatedMovies(){ 
    const topRatedMoviesURL = getUrl("/movie/top_rated");
  
    const rawResponse = await getData(topRatedMoviesURL);
  
    state.movies.topRated = rawResponse.results;
  
    return rawResponse;

}

async function getPopTvSeries(){ 
    const popTvSeriesURL = getUrl("/tv/popular");
  
    const rawResponse = await getData(popTvSeriesURL);
  
    state.tvSeries.popular = rawResponse.results;
  
    return rawResponse;

}

/**
 * listener sul lifecycle "DOMContentLoaded"
 *
 * esegue la funzione handleHTMLMounted appena l'html del nostro
 * index.html è stato stampato a video
 *
 * rimuove il listenr una volta terminata l'operazione con {once: true}
 */
document.addEventListener("DOMContentLoaded", handleHTMLMounted, {
  once: true
});

function overlayOff(){ 
  document.querySelector("#overlay").style.display = "none"; //chiusura overlay//
}

document.querySelector('#overlay').addEventListener("click", overlayOff);//ascolto su overlay per la chiusura//