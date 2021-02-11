/*
Working process:
  1. On page loading, uses the present API key get the movies/tv's list
  2. Get user permission via authentication on themoviedb.org
  3. Get a valid user session ID and enables the watchlist buttons
  4. 

*/

// With ES6 modules, chrome present a problem with CORS policy
// It needs a server, becouse Chrome interrupt the call to API
import createCardMovie from './card.js';

function getAuthTokenOnLoad() {
  fetch(`${baseMovieDBURL}authentication/token/new?api_key=${APIKEY}`)
    .then((r) => r.json())
    .then((data) => requestToken = data.request_token)
  
  getPopularMovies();
  getPopularSeries();
  getTopRatedMovies();
  getTopRatedSeries();
  getValidSessionID();
}

function getUserPermission() {
  open(`https://www.themoviedb.org/authenticate/${requestToken}`);
  getUserPermissionBtn.style.display = 'none';
}

function getValidSessionID() {
  fetch(`${baseMovieDBURL}authentication/session/new?api_key=${APIKEY}`, {
    method: "POST",
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      "request_token": requestToken
    })
  })
    .then((r) => r.json())
    .then((data) => {
      sessionID = data.session_id;

      // Then get the User's info and enables the button for adding the specific
      // movie (id) to the watchlist
      if(sessionID) {        
        fetch(`https://api.themoviedb.org/3/account?api_key=${APIKEY}&session_id=${sessionID}`)
          .then ((r) => r.json())
          .then((data) => userInfo = data)
        
        getUserValidSessionID.style.display = 'none';
        goToWatchlistBtn.style.display = 'inline-block';

        startModal('Permission granted ');

        showWatchlistButtonInCard();
      }
    })
}

// GETting data funcs.
function getPopularMovies() {
  fetch(`${baseMovieDBURL}movie/popular?api_key=${APIKEY}&language=en-US&page=1`)
    .then((r) => r.json())
    .then((data) => getMovieInfo(data.results, wrapperPopMovies))
}

function getPopularSeries(){
  fetch((`${baseMovieDBURL}tv/popular?api_key=${APIKEY}&language=en-US&page=1`))
    .then((r) => r.json())
    .then((data) => getMovieInfo(data.results, wrapperPopTv))
}

function getTopRatedMovies() {
  fetch(`${baseMovieDBURL}movie/top_rated?api_key=${APIKEY}&language=en-US&page=1`)
    .then((r) => r.json())
    .then((data) => getMovieInfo(data.results, wrapperTopRatedMovies))
}

function getTopRatedSeries() {
  fetch(`${baseMovieDBURL}tv/top_rated?api_key=${APIKEY}&language=en-US&page=1`)
    .then((r) => r.json())
    .then((data) => getMovieInfo(data.results, wrapperTopRatedSeries))
}

// POSTing data funcs. -- needs showWatchlistButtonInCard func.
function setAsWatchlist(type, movieID){
  try {
    fetch(`${baseMovieDBURL}account/${userInfo.id}/watchlist?api_key=${APIKEY}&session_id=${sessionID}`, {
      method: "POST",
      headers: { 'Content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        "media_type": type,
        "media_id": movieID,
        "watchlist": true
      }) 
    })  

    startModal('Added to the watchlist');

  } catch (error) {
    console.log('Non ci sono i dati dell\'utente:', error)
  }
}

function rmFromWatchlist(type, movieID){
  try {
    fetch(`${baseMovieDBURL}account/${userInfo.id}/watchlist?api_key=${APIKEY}&session_id=${sessionID}`, {
      method: "POST",
      headers: { 'Content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        "media_type": type,
        "media_id": movieID,
        "watchlist": false
      }) 
    }) 
    
    startModal('Removed from the watchlist');
    
  } catch (error) {
    console.log('Non ci sono i dati dell\'utente:', error)
  }
}

// Enables button 'Add to watch list'
function showWatchlistButtonInCard () {
  const setMovieAsWatchlistEl = document.querySelectorAll('.addToWatchListBtn');
  const rmMovieFromWatchlistEl = document.querySelectorAll('.rmFromWatchListBtn');
  
  setMovieAsWatchlistEl.forEach((movie) => {
    movie.classList.add("addToCard");
    movie.addEventListener('click', (e) => setAsWatchlist("movie", e.path[1].id));
  })

  rmMovieFromWatchlistEl.forEach((movie) => {
    movie.classList.add("addToCard");
    movie.addEventListener('click', (e) => rmFromWatchlist("movie", e.path[1].id));
  })

}

// Get movie List
function getMovieInfo(moviesList, parent) {
  moviesList.map((movie) => {
    const movieInfo = {
      img: `https://www.themoviedb.org/t/p/w342` + movie.poster_path,
      title: movie.title || movie.name,
      link: 'http://google.com',
      addWatchList: 'http://google.com',
      hideIt: 'http://google.com',
      description: limitDescriptionLength(movie.overview),
    }
    const { img, title, link, addWatchList, hideIt, description } = movieInfo;

    createCardMovie(img, title, description, addWatchList, hideIt, link, parent, movie);
  }) 
}

// If the description is too long split and add three full stops
function limitDescriptionLength(data) {
  if (data.length >= 104) return data.substr(0, 104)+' ...';
  else return data
}

// Modal
function startModal(message) {
  const watchListModal = document.querySelector('.watchListModal');
  watchListModal.textContent = message;
  watchListModal.classList.toggle('showWatchListModal');
  setTimeout(() => {
    watchListModal.classList.toggle('showWatchListModal');
  }, 1250)
}
  

// Init
const state = {
  baseMovieDBURL: 'https://api.themoviedb.org/3/',
  APIKEY: '3e097ab0145d7f55f3ad142f59498fb7',
  requestToken: null,
  sessionID: null,
  userInfo: null,
  watchList: null,
}

let { baseMovieDBURL, APIKEY, requestToken, sessionID, userInfo, watchList } = state;
window.addEventListener('load', getAuthTokenOnLoad, { once: true });

const wrapperPopMovies = document.querySelector('.wrapperPopMovies');
const wrapperPopTv = document.querySelector('.wrapperPopTv');
const wrapperTopRatedMovies = document.querySelector('.wrapperTopMovies');
const wrapperTopRatedSeries = document.querySelector('.wrapperTopSeries');

// CAROSELLO BTNs
const flowMoviesRight = (e) => e.path[2].children[2].scrollBy(-400, 0);
const flowMoviesLeft = (e) => e.path[2].children[2].scrollBy(400, 0);

const caroselloBtnRight = document.querySelectorAll('.caroselloBtn__buttonRight');
const caroselloBtnLeft = document.querySelectorAll('.caroselloBtn__buttonLeft');

caroselloBtnRight.forEach((btn) => btn.addEventListener('click', flowMoviesRight));
caroselloBtnLeft.forEach((btn) => btn.addEventListener('click', flowMoviesLeft));

// BUTTONS for test
const getUserPermissionBtn = document.querySelector('.getUserPermissionBtn');
getUserPermissionBtn.addEventListener('click', getUserPermission);

const getUserValidSessionID = document.querySelector('.getUserValidSessionID');
getUserValidSessionID.addEventListener('click', getValidSessionID);













// TEST WATCHLIST
async function getWatchListData() {
  const res = await fetch(`${baseMovieDBURL}account/${userInfo.id}/watchlist/movies?api_key=${APIKEY}&language=en-US&session_id=${sessionID}&sort_by=created_at.asc&page=1`); 
  const data = await res.json();
  watchList = data.results;

  getWatchlistPage(watchList);
}

function showWatchlistOnDOM() {  
  mostPopularEls.forEach((el) => el.classList.toggle('watchlist__hide'));
  watchlistSection.style.display = 'block';
}

function getWatchlistPage(watchlist) {
  watchlistWrapper.textContent = '';
  watchlist.map((movie) => {
    const movieInfo = {
      img: `https://www.themoviedb.org/t/p/w342` + movie.poster_path,
      title: movie.title || movie.name,
      link: 'http://google.com',
      addWatchList: 'http://google.com',
      hideIt: 'http://google.com',
      description: limitDescriptionLength(movie.overview),
    }
    const { img, title, link, addWatchList, hideIt, description } = movieInfo;

    createCardMovie(img, title, description, link, false, false, watchlistWrapper, "INFO");
  })
}

const mostPopularEls = document.querySelectorAll('.mostPopular');
const watchlistSection = document.querySelector('.watchlist');
const watchlistWrapper = document.querySelector('.watchlist__wrapper');
const goToWatchlistBtn = document.querySelector('.goToWatchlist');

goToWatchlistBtn.addEventListener('click', getWatchListData);
goToWatchlistBtn.addEventListener('click', showWatchlistOnDOM);