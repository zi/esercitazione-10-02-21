const TOAST = document.querySelector(".toast");
const POPULAR_MOVIES = document.querySelector("#popularMovies");
const TOP_RATED_MOVIES = document.querySelector("#topRatedMovies");
const TV_POPULAR = document.querySelector("#popularTv");

const state = {
  config: {
    api_key: "f77033c1d0b6830581c0191d91ecddb7",
    base_url: "https://api.themoviedb.org/3",
    images: null
  },
  popular_movies: null,
  top_rated:null,
  tv_popular:null
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

/**
 * Actions per caricare i dati
 */

/**
 * crea un guest session id e ritorna un oggetto con i dati riguardati la sessione
 *
 * @link https://developers.themoviedb.org/3/authentication/create-guest-session
 */
async function getGuestSession() {
  const guestSessionUrl = getUrl("/authentication/guest_session/new");

  const result = await getData(guestSessionUrl);

  return result;
}

/**
 * ottiene i dati di configurazione
 *
 * @link https://developers.themoviedb.org/3/configuration/get-api-configuration
 */
async function getConfiguration() {
  const configurationUrl = getUrl("/configuration");

  const result = await getData(configurationUrl);

  // aggiorniamo il nostro state interno con i dati ricevuti
  state.config.images = result.images;

  return result;
}

/**
 * ottiene i la lista di film più popolari
 *
 * @link https://developers.themoviedb.org/3/movies/get-popular-movies
 */
async function getPopularMovies() {
  const popularMoviesURL = getUrl("/movie/popular");

  const rawResponse = await getData(popularMoviesURL);

  state.movies = rawResponse.results;

  return rawResponse;
}
/* 
  ottiene la lista dei film più votati
*/
async function getTopRatedMovies() {
  const topRatedURL = getUrl("/movie/top_rated");

  const rawResponse = await getData(topRatedURL);

  state.top_rated = rawResponse.results;

  return rawResponse;
}

/* 
  ottiene la lista delle serie più popolari
  
*/

async function getTopPopularTv() {
  const topRatedURL = getUrl("/tv/popular");

  const rawResponse = await getData(topRatedURL);

  state.tv_popular = rawResponse.results;
  return rawResponse;
}
/**
 * gestisce la sessione guest dell'utente
 *
 * NOTA:
 * durante le fasi della funzione tornniamo un valore boolean.
 * Questo viene utilizzato da Promise.all in handleHTMLMounted
 * per capire quando la nostra funzione a terminato
 * essendo asincrona.
 *
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

      // mostra il toastBaner per dare un feedback alll'utente
      showToast("Hey! Adesso sei registrato come guest");

      return true;
    }

    return false;
  } else {
    // se sessionData ha un valore

    // trasforma la stringa ottenuta da localSotarge in oggetto o variabile primitiva
    const parsedSessionData = JSON.parse(sessionData);

    /**
     * controlliamo che la sessione non sia scacduta
     *
     * la data di scadenza della sessione è contenuta
     * nell'oggetta della sessione sotto il nome "expires_at"
     *
     * utilizziamo Date per verificare se la data di scadenza è inferiore
     * alla data attuale nel momento in cui sta eseguendo questo codice.
     *
     * trasformiamo le due date con getTime() in un numero che corrisponde
     * ai millisecondi compresi tra la data usata e il 1 gennaio 1970
     * (è uno standard per avere una costante di riferimento)
     *
     */
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

/**
 * Crea una card per i film / serie tv
 */
function getMovieCard(imgURL, title) {
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
    const imgURL = getImageUrl(item.backdrop_path);

    const movieCard = getMovieCard(imgURL, item.title || item.name);

    sectionNode.appendChild(movieCard);
  });
}

/**
 * funzione che ottiene i dati dall'eseterno,
 * e quando li ha ottenuti renderizza il carosello dei film popolari
 */
function handleHTMLMounted() {
  Promise.all([handleSession(), getConfiguration(), getPopularMovies(), getTopRatedMovies(), getTopPopularTv()]).then(
    () => {
      // ci permette di lavorare con i dati ottenuti dall'esterno
      renderCarousel(state.movies, POPULAR_MOVIES);
      renderCarousel(state.top_rated, TOP_RATED_MOVIES);
      renderCarousel(state.tv_popular, TV_POPULAR );

    }
  );
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
