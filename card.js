function createCardMovie(img, title, description, link, addWatchList, hideIt, parent, INFO) {
  const card = document.createElement('div');
  card.classList.add('card');

  const cardLink = document.createElement('a');
  const cardImage = document.createElement('img');
  cardImage.classList.add('card__image');
  cardImage.src = img;
  cardLink.append(cardImage);

  // CardContent
  const cardContent = document.createElement('div');
  cardContent.classList.add('cardContent');
  const cardContentStatusBar = document.createElement('div');
  cardContentStatusBar.classList.add('cardContent__statusBar');
  cardContent.appendChild(cardContentStatusBar);

  // CardContent__statusBar --> First <a>
  const cardStatusLink = document.createElement('a');
  cardStatusLink.src = link;
  const cardStatusLinkBtn = document.createElement('button');
  const cardStatusLinkBtnIco = document.createElement('i');
  cardStatusLinkBtnIco.className = 'fa fa-play-circle';
  cardStatusLinkBtn.appendChild(cardStatusLinkBtnIco);
  cardStatusLink.appendChild(cardStatusLinkBtn);
  const cardStatusLinkPar = document.createElement('p');
  const cardStatusLinkStrong = document.createElement('strong');
  cardStatusLinkStrong.textContent = 'Riproduci';
  cardStatusLinkPar.appendChild(cardStatusLinkStrong);
  cardStatusLink.appendChild(cardStatusLinkPar);
  cardContentStatusBar.appendChild(cardStatusLink);

  // CardContent__statusBar --> icons <div>
  const iconsRowDiv = document.createElement('div');
  const iconsRowFirst = document.createElement('a');
  iconsRowFirst.src = addWatchList;
  const iconsRowBtnFirst = document.createElement('button');
  iconsRowBtnFirst.classList.add("addToWatchListBtn");
  iconsRowBtnFirst.id = INFO.id;
  iconsRowBtnFirst.title = 'Add to Watchlist';
  const iconsRowBtnFirstIcon = document.createElement('i');
  iconsRowBtnFirstIcon.className = "fa fa-plus";
  iconsRowBtnFirst.appendChild(iconsRowBtnFirstIcon);
  iconsRowFirst.appendChild(iconsRowBtnFirst);
  const iconsRowSecond = document.createElement('a');
  iconsRowSecond.src = hideIt;
  const iconsRowBtnSecond = document.createElement('button');
  iconsRowBtnSecond.classList.add("rmFromWatchListBtn");
  iconsRowBtnSecond.id = INFO.id;
  iconsRowBtnSecond.title = 'Remove from Watchlist';
  const iconsRowBtnSecondIcon = document.createElement('i');
  iconsRowBtnSecondIcon.className = "fa fa-ban";
  iconsRowBtnSecond.appendChild(iconsRowBtnSecondIcon);
  iconsRowSecond.appendChild(iconsRowBtnSecond);
  iconsRowDiv.append(iconsRowFirst, iconsRowSecond);
  cardContentStatusBar.appendChild(iconsRowDiv);

  // CardContent__desc
  const cardContentDesc = document.createElement('div');
  cardContentDesc.classList.add('cardContent__desc');
  const cardContentDescParFirst = document.createElement('p');
  const cardContentDescStrongFirst = document.createElement('strong');
  cardContentDescStrongFirst.textContent = 'Incluso con Prime';
  cardContentDescParFirst.appendChild(cardContentDescStrongFirst);
  const cardContentDescStrongSecond = document.createElement('strong');
  cardContentDescStrongSecond.textContent = title;
  const cardContentDescParSecond = document.createElement('p');
  cardContentDescParSecond.textContent = description;
  cardContentDesc.append(cardContentDescParFirst,
                         cardContentDescStrongSecond,
                         cardContentDescParSecond);
  cardContent.appendChild(cardContentDesc);

  // CardContent__desc
  const cardContentInfo = document.createElement('div');
  cardContentInfo.classList.add('cardContent__info');
  const cardContentInfoFirst = document.createElement('i');
  cardContentInfoFirst.textContent = '2020';
  const cardContentInfoSecond = document.createElement('i');
  cardContentInfoSecond.className = 'fa fa-comment-o';
  const cardContentInfoThird = document.createElement('i');
  cardContentInfoThird.textContent = '16+';
  cardContentInfo.append(cardContentInfoFirst,
                         cardContentInfoSecond,
                         cardContentInfoThird);
  cardContent.appendChild(cardContentInfo);

  card.append(cardLink, cardContent)
  parent.appendChild(card);
}

export default createCardMovie;