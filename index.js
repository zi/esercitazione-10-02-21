// //Esercizio 1

// let body = document.querySelector('body');

// async function getErrorFromAPI() {
//     try {
//         const response = await fetch("https://api.musement.com/api/v3/ci");

//         if (!response.ok) {
//             throw new Error(`status chiamata ${response.status}`);
//         }
//     } catch (message) {
//         let div = document.createElement('div');
//         div.classList.add('errore');
//         body.appendChild(div);
//         let testo = document.createTextNode(message);
//         div.appendChild(testo);
//     }
// }

// getErrorFromAPI();

//Esercizio 2+3+4
const TOAST = document.querySelector(".toast");
const POPULAR_MOVIES = document.querySelector("#popularMovies");

const state = {
    config: {
        api_key: "40fb3f5ef8eb9771ea18208eab90c8fd",
        base_url: "https://api.themoviedb.org/3",
        images: null
    },
    movies: null
};


document.addEventListener("DOMContentLoaded", handleHTMLMounted, {
    once: true
});

function getUrl(pathName) {
    const { api_key, base_url } = state.config;

    return `${base_url}${pathName}?api_key=${api_key}`;
}

function getImageUrl(imgPath) {

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


async function getGuestSession() {
    const guestSessionUrl = getUrl("/authentication/guest_session/new");

    const result = await getData(guestSessionUrl);

    return result;
}


async function getConfiguration() {
    const configurationUrl = getUrl("/configuration");

    const result = await getData(configurationUrl);

    // aggiorniamo il nostro state interno con i dati ricevuti
    state.config.images = result.images;

    return result;
}


async function getPopularMovies() {
    const popularMoviesURL = getUrl("/movie/popular");

    const rawResponse = await getData(popularMoviesURL);

    state.movies = rawResponse.results;

    return rawResponse;
}


async function handleSession() {
    const sessionData = localStorage.getItem("mdb_session");

    if (!sessionData) {
        const newSessionData = await getGuestSession();

        if (newSessionData) {
            const sessionDataString = JSON.stringify(newSessionData);
            localStorage.setItem("mdb_session", sessionDataString);
            showToast("Hey! Adesso sei registrato come guest");
            return true;
        }

        return false;
    } else {

        const parsedSessionData = JSON.parse(sessionData);
        const expiresDate = new Date(parsedSessionData.expires_at).getTime();
        const nowDate = new Date().getTime();

        if (expiresDate < nowDate) {
            localStorage.removeItem("mdb_session");
            await handleSession();

            return true;
        }
        return true;
    }
}


function showToast(text) {
    TOAST.textContent = text;
    TOAST.classList.toggle("toast__is-hidden");

    setTimeout(() => {
        TOAST.classList.toggle("toast__is-hidden");
    }, 4000);
}


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

function renderCarousel(list, sectionNode) {
    list.forEach((item) => {
        // ottiene la url dell'immagine completa
        const imgURL = getImageUrl(item.backdrop_path);

        const movieCard = getMovieCard(imgURL, item.title);

        sectionNode.appendChild(movieCard);
    });
}


function handleHTMLMounted() {
    Promise.all([handleSession(), getConfiguration(), getPopularMovies()]).then(
        () => {
            renderCarousel(state.movies, POPULAR_MOVIES);
        }
    );
}


