//ESERCIZIO #1
/* Aggiungerei carousel per i film più votati 
https://developers.themoviedb.org/3/movies/get-top-rated-movies */

const btn_topMovies = document.querySelector('#btn_topMovies');
const btn_popularTV = document.querySelector('#btn_popularTV');
const doc_main = document.querySelector('main');

const state = {
    config: {
        base_api_url: "https://api.themoviedb.org/3/",
        api_key: 'ebb736fb6b92bbb03b0837dd3b5e18d3',
        language: 'it-IT',
        error_mess: 'La richiesta non è andata a buon fine :/'
    },

    movies: null
}

function utility(path) {
    const completeURL = `${state.config.base_api_url}${path}?api_key=${state.config.api_key}&language=${state.config.language}`;
    
    return completeURL;
}

function getPosterURL(posterPath) {
  return `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${posterPath}`;
}

//ricevendo in input il JSON di un film, seleziona gli elementi di interessa e li raggruppa in un div
function createMovieCard(film) {
    const card = document.createElement('div');
    const poster = document.createElement('img');
    const title = document.createElement('h3');
    const rank = document.createElement('p');

    const image = getPosterURL(film.poster_path);
    poster.src = image;
    title.textContent = film.title;
    rank.textContent = `Valutazione: ${film.vote_average}`;

    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(rank);

    return card;
}

async function getTopMovies() {
    try {
        const request = utility('movie/top_rated');
        console.log('URL di richiesta: ',request);


        const response = await fetch(request);

        if (!response.ok) {
            throw error;
        }

        const result = await response.json();

        state.movies = result.results;

        console.log('Film più votati: \n', state.movies);

        const topMoviesCards = document.createElement('div');

        //per ogni film, creiamo una card, che viene inserita nel div topMoviesCards
        for (movie of result.results) {
            const movie_card = createMovieCard(movie);

            movie_card.classList.add('card')

            topMoviesCards.appendChild(movie_card);
            }

        topMoviesCards.classList.add('cards_wrapper');

        //... infine, inseriamo nel main la collezione di film raccolti in topMoviesCards
        doc_main.appendChild(topMoviesCards);


    }

    catch (err) {
        console.error(err);
        console.log('Errore:', state.config.error_mess);

        const errorText = document.createElement('div');
        errorText.classList.add('banner_err');

        errorText.textContent = 'Si è verificato un errore!';

        doc_main.appendChild(errorText);
    }
}

btn_topMovies.addEventListener('click', getTopMovies);

// ESERCIZIO #2

/* Aggiungere carousel per le serie TV più popolari 
https://developers.themoviedb.org/3/tv/get-popular-tv-shows */

async function getPopularShows() {
    try {
        const request = utility('tv/popular');
        console.log('URL di richiesta: ',request);


        const response = await fetch(request);

        if (!response.ok) {
            throw error;
        }

        const result = await response.json();

        state.shows = result.results;

        console.log('Serie più popolari: \n', state.shows);

        const topMoviesCards = document.createElement('div');

        //per ogni serie, creiamo una card, che viene inserita nel div topMoviesCards
        for (movie of result.results) {
            const movie_card = createMovieCard(movie);

            movie_card.classList.add('card')

            topMoviesCards.appendChild(movie_card);
            }

        topMoviesCards.classList.add('cards_wrapper');

        //... infine, inseriamo nel main la collezione di film raccolti in topMoviesCards
        doc_main.appendChild(topMoviesCards);


    }

    catch (err) {
        console.error(err);
        console.log('Errore:', state.config.error_mess);

        const errorText = document.createElement('div');
        errorText.classList.add('banner_err');

        errorText.textContent = 'Si è verificato un errore!';

        doc_main.appendChild(errorText);
    }
}

btn_popularTV.addEventListener('click', getPopularShows);
