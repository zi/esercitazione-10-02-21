const toast = document.querySelector(".toast");
const popular_movies = document.querySelector("#popularMovies");
const most_Voted_Movies = document.querySelector("#mostVotedMovies");
const popular_TV_series = document.querySelector("#popularTVseries");

const pop_movies_list = document.querySelector("#popularMovies");
const most_rated_movies_list = document.querySelector("#mostVotedMovies");
const pop_Tv_series_list = document.querySelector("#popularTVseries");

//dichiarazione dello stato dell'applicazione
const state = {
    config: {
        base_url: "https://api.themoviedb.org/3",
        api_key: "cf0a57c473ba44d419e6abdf78687e28",
        images: null
    },
    movies: null,
    most_rated_movies: null,
    tv_series: null
}

//creazione delle funzioni utility

function getConstantUrl(pathName) {
   return `${state.config.base_url}${pathName}?api_key=${state.config.api_key}`;
}//creazione dell'URL di base

function getImageUrl(imgPath) {
    const { secure_base_url, backdrop_sizes } = state.config.images
    return `${secure_base_url}${backdrop_sizes[0]}${imgPath}`;
}//creazione della URL per reperire le immagini


//creazione della funzione utility di base che chiama i dati e gestisce l'eventuale errore
async function getData(url) {
    try {
        const response = await fetch (url);
        const result = await response.json();
        if (!response.ok) {
            throw result;
        }
        return result;
    } catch (errorMessage) {
        console.log(errorMessage);
    }
}

//creazione della guestSession 
async function getGuestSession() {
    const guestSessionUrl = getConstantUrl("/authentication/guest_session/new");
    const result = await getData(guestSessionUrl);
    return result;
}

//creazione della funzione di configurazione per costruire l'URL dell'immagine 
async function getConfiguration() {
    const configurationUrl = getConstantUrl("/configuration");
    const result = await getData(configurationUrl);
    
    state.config.images= result.images; //aggiunta dei dati ricevuti all'interno dello stato dell'applicazione
    return result;
}

//creazione della funzione per ottenere la lista dei film popolari
async function getPopularMovies() {
    const popularMoviesUrl = getConstantUrl("/movie/popular");
    const pop_mov_results = await getData(popularMoviesUrl);

    //aggiungiamo i risultati al nostro stato interno
    state.movies = pop_mov_results.results;

    return pop_mov_results;
}

//creazione della funzione per ottenere la lista dei film più votati
async function getRatedMovies() {
    const ratedMoviesUrl = getConstantUrl("/movie/top_rated");
    const rate_mov_results = await getData(ratedMoviesUrl);

    //aggiungiamo i risultati al nostro stato interno
    state.most_rated_movies = rate_mov_results.results;

    return rate_mov_results;
}

//creazione della funzione per ottenere la lista delle serie TV più popolari 
async function getPopularTvShows() {
    const popularTvShowsUrl = getConstantUrl("/tv/popular");
    const pop_TVshows_results = await getData(popularTvShowsUrl);

    //aggiungiamo i risultati al nostro stato interno
    state.tv_series = pop_TVshows_results.results;

    return pop_TVshows_results;
}

//gestione della sessione guest dell'utente
async function handleSession() {
    const sessionData = localStorage.getItem("mdb_session");//ottiene il dato dal localStorage

    if (!sessionData) {
        const newSessionData = await getGuestSession();
        //ovvero, se sessionData è undefined, crea una nuova SessionData

        if (newSessionData) {
            const sessionDataString = JSON.stringify(newSessionData);
            // se la chiamata a getGuestSession alla riga 98 ritorna un valore, si trasforma l'oggetto ricevuto in stringa 
      
            localStorage.setItem("mdb_session", sessionDataString)
            //aggiungiamo il valore ottenuto nel localStorage

            showToast("Hey! Adesso sei registrato come guest");
            //infine, mostra il toastBanner per dare un feedback all'utente

            return true; //dato che il parametro è un booleano, la funzione ritorna true
        }

      return false; // ??se la chiamata a getGuestSession non ritorna un valore, quindi non è possibile creare una nuova SessionData, ritorna false?? È questo il senso del return false?

    }   else{ // se sessionData ha un valore: 
            const parsedSessionData = JSON.parse(sessionData);// 1.Si parsa la stringa trasformandola in oggetto

            const expiresDate = new Date(parsedSessionData.expires_at).getTime();
            const nowDate = new Date().getTime();
            //2. Si controlla che la sessione non sia scaduta, utilizzando Date per verificare se la data di scadenza è inferiore alla data in cui si esegue il codice
            // Entrambe le date vengono modificate con getTime in un numero che corrisponde, per convenzione, ai millisecondi compresi tra la data indicata e il 1 gennaio 1970
            if (expiresDate<nowDate) {
                localStorage.removeItem("mdb_session"); //quindi, se la sessione è scaduta, rimuoviamo i dati della sessione dal local storage
                await handleSession(); //dopodiché chiamiamo la funzione stessa per gestire la creazione di una nuova sessione e l'inserimento nel localStorage (funzione ricorsiva)
                return true;
            }
            return true; // quindi, se sessionData ha un valore, ritorna true
        }

}     

//creazione della funzione che mostra il banner con il relativo messaggio(riga 108) passato come parametro, e lo fa scomparire dopo 4 secondi
function showToast(text) {
    toast.textContent = text;
    toast.classList.toggle("toast__is-hidden");
  
    setTimeout(() => {
        toast.classList.toggle("toast__is-hidden");
    }, 4000);
}

//creazione delle card per i film più popolari
function getMovieCard(imgURL, title) {
    const popFilmCardWrap = document.createElement("div");
    const coverImg = document.createElement("img");
  
    const textWrap = document.createElement("div");
    const text = document.createElement("h3");
  
    popFilmCardWrap.classList.add("card");
    textWrap.classList.add("card__title_wrap");
  
    text.textContent = title;
    coverImg.src = imgURL;
  
    textWrap.appendChild(text);
    popFilmCardWrap.append(coverImg, textWrap);
  
    return popFilmCardWrap;
}
    
//creazione delle card per i film più votati
function getRatedMovieCard(imgURL, title) {
    const ratedFilmCardWrap = document.createElement("div");
    const coverImg = document.createElement("img");
  
    const textWrap = document.createElement("div");
    const text = document.createElement("h3");
  
    ratedFilmCardWrap.classList.add("card");
    textWrap.classList.add("card__title_wrap");
  
    text.textContent = title;
    coverImg.src = imgURL;
  
    textWrap.appendChild(text);
    ratedFilmCardWrap.append(coverImg, textWrap);
  
    return ratedFilmCardWrap;
}

//creazione delle card per le serie TV
function getTvSeriesCard(imgURL, name) {
    const tvSeriesCardWrap = document.createElement("div");
    const coverImg = document.createElement("img");
  
    const textWrap = document.createElement("div");
    const text = document.createElement("h3");
  
    tvSeriesCardWrap.classList.add("card");
    textWrap.classList.add("card__title_wrap");
  
    text.textContent = name;
    coverImg.src = imgURL;
  
    textWrap.appendChild(text);
    tvSeriesCardWrap.append(coverImg, textWrap);
  
    return tvSeriesCardWrap;
}

//render delle card dei film popolari
function renderMoviesCarousel(list) {
    list.forEach((item) => {
      // ottiene la url dell'immagine completa
      const imgURL = getImageUrl(item.backdrop_path);
  
      const movieCard = getMovieCard(imgURL, item.title);
  
      pop_movies_list.append(movieCard);
    });
}

//render delle card dei film più votati
function renderRatedMoviesCarousel(list) {
    list.forEach((item) => {
      
      const imgURL = getImageUrl(item.backdrop_path);
  
      const movieCard = getRatedMovieCard(imgURL, item.title);
  
      most_rated_movies_list.append(movieCard);
    });
}

//render delle card delle serie TV 
function renderTvSeriesCarousel(list) {
    list.forEach((item) => {
      
      const imgURL = getImageUrl(item.backdrop_path);
  
      const movieCard = getTvSeriesCard(imgURL, item.name);
  
      pop_Tv_series_list.append(movieCard);
    });
}

//funzione che ottiene i dati dall'esterno e, una volta ottenuti, renderizza i caroselli
function handleHTMLMounted() {
    Promise.all([handleSession(), getConfiguration(), getPopularMovies(), getRatedMovies(), getPopularTvShows()]).then(
      () => {
        // per lavorare con i dati ottenuti dall'esterno
        renderMoviesCarousel(state.movies, popular_movies);
        renderRatedMoviesCarousel(state.most_rated_movies, most_Voted_Movies);
        renderTvSeriesCarousel(state.tv_series, popular_TV_series);
      }
    );
}

//listener sul lifecycle "DOMContentLoaded" che esegue la funzione handleHTMLMounted dopo che è stato renderizzato l'HTML
document.addEventListener("DOMContentLoaded", handleHTMLMounted, {
    once: true
});
