//Es. 1 
// Utilizzando try / catch, async / await e fetch, definire una funzione per ottenere le città
// tramite l’url https://api.musement.com/api/v3/cities.
// Gestire l’errore con throw. In caso di errore far apparire un banner rosso con la scritta
// “Ops, c’è stato un errore”.
// Nota: per forzare un errore basta scrivere in modo errato l’url del fetch.

// const mainWrapper = document.querySelector('.main-wrapper')
// const bannerRed = document.querySelector('#banner')


// async function stateCity() {
//     try {
//         const response = await fetch('https://api.musement.com/api/v3/CIAO.')
//         const result = await response.json();

//         console.log(result)

//         if (!response.ok) {
//             const errorMessage = await response.json()
//             throw errorMessage
//         }


//     } catch (errorMessage) {
//         console.log('catch error')

//         bannerRed.style.display = 'block';
//         bannerRed.style.backrgroundColor = 'red';
//         bannerRed.textContent = 'Ops, c’è stato un errore'
//         return
//     }
// }

// stateCity();


//Es. 2 
//Impostare lo stato interno della nostra applicazione con una chiave “config”, nel quale tenere
// salvato i dati utili per effettuare le chiamate con fetch di MovieDB.
// Creare una funzione utility che passato un path come parametro ritorni la url completa da
// utilizzare.
// Aggiungere un’altra chiave allo state dell’applicativo chiamata “movies”.
// Eseguire una chiamata al DOMContentLoaded della pagina che carichi i film più popolari
// (utilizzare sempre try / catch, async / await , throw e fetch) e che li salvi nello stato sotto
// “movies” e poi stampi in console il risultato.
// Con l’errore visualizzare il banner dell’esercizio 1.

const state = {
    config: {
        api_key: '376537f7a1b3b041b852109d552d082c',
        base_url: 'https://api.themoviedb.org/3/',
        popular: 'movie/popular'
    },
    movies: null,
}

function getUrl(pathName) {
    return `${state.config.base_url}${pathName}?api_key=${state.config.api_key}`
}

async function getGuestMovie() {
    const guestMoviePopular = state.config.popular;
    //ricordare così oppure es.__const guestMoviePopular = 'movie/popular' ma non c'è bisogno//
    // url completa
    const guestMovieURL = getUrl(guestMoviePopular)

    try {

        const response = await fetch(guestMovieURL)
        console.log('response', response)
        const result = response.json()

        if (!response.ok) {

            throw result
                // gestione errore
                // const errorMessage = await response.json()
                // throw errorMessage
                // }
        }

        return result

    } catch (errorMessage) {

        console.log(errorMessage)

        if (errorMessage) {

            console.log('Verifica API_KEY sia corretta..')

        } else if (errorMessage) {

            console.log('Verifica che il pathName sia scritto correttamente...')

            bannerRed.textContent = 'Ops, c’è stato un errore'
        }
    }
}
// state.movies = getGuestMovie();
getGuestMovie().then((data) => {
    state.movies = data.results;
    console.log(state)
});

console.log(state)

document.addEventListener("DOMContentLoaded", getUrl);





// //Es. 3 
// const mainWrapper = document.querySelector('.main-wrapper')

// const SaveBtn = document.querySelector('#saveButton')
// const RemoveBtn = document.querySelector('#removeButton')


// loadGuestSession();

// async function handleGuestSession() {

//     // SET ITEM
//     const guestSessionId = localStorage.setItem('test_storage')
//     console.log('SET ITEM: ', guestSessionId)


//     // GET ITEM
//     const guestSessionId = localStorage.getItem('test_storage')
//     if (!guestSessionId) {

//     }
//     console.log('GET ITEM: ', guestSessionId)
//     SaveBtn.addEventListener('click', handleGuestSession)

//     // REMOVE ITEM
//     const guestSessionId = localStorage.removeItem('test_storage')
//     console.log('REMOVE ITEM: ', guestSessionId)
//     RemoveBtn.removeEventListener('click', handleGuestSession)


//     if (!guestSessionId) {
//         const guestSessionObject = await getGuestSession()
//         console.log('il loadGuestSession è finito!')

//         if (guestSessionObject) {
//             //   const value = `${guestSessionObject.guest_session_id}&${guestSessionObject.expires_at}`
//             const value = JSON.stringify(guestSessionObject)
//             localStorage.setItem('test_storage', value)
//         }
//     }
// }
// handleGuestSession()