'use strict';

var MAP_HEIGHT = 630;
var EMPTY_MAP_SPACE = 130;
var PIN_WIDTH = 50;

// создание объекта-похожего объявления
var avatars = [1, 2, 3, 4, 5, 6, 7, 8];

var generateSimilarPoster = function() {

  var similarPoster = {
    'author': {
      'avatar': ''
    },
    'offer': {
      'type': ''
    },
    'location': {
      'x': '',
      'y': ''
    }
  };

  var calcRandomOfArray = function(array) {
    var random = Math.floor(Math.random() * array.length);
    return random;
  };
  var calcRandomOfDiapason = function(diapason) {
    var random = Math.round(Math.random() * diapason);
    return random;
  };

  var randomNumber = calcRandomOfArray(avatars);
  var avatarNumber = avatars[randomNumber];
  avatars.splice(randomNumber, 1);

  var userAvatar = 'img/avatars/user0' + avatarNumber + '.png';
  similarPoster.author.avatar = userAvatar;

  var typesOfOffer = ['palace', 'flat', 'house', 'bungalo'];
  var typeOfOffer = typesOfOffer[calcRandomOfArray(typesOfOffer)];
  similarPoster.offer.type = typeOfOffer;

  var map = document.querySelector('.map');
  var mapWidth = map.clientWidth;
  var positionX = calcRandomOfDiapason(mapWidth);

  var workspaceHeight = MAP_HEIGHT - EMPTY_MAP_SPACE;
  var positionY = calcRandomOfDiapason(workspaceHeight) + EMPTY_MAP_SPACE;

  similarPoster.location.x = positionX;
  similarPoster.location.y = positionY;

  return similarPoster;
}

// создание массива объектов-объявлений
var similarPosters = [];

for (var i = 0; i < 8; i++) {
  var similarPoster = generateSimilarPoster();
  similarPosters.push(similarPoster);
};

document.querySelector('.map').classList.remove('map--faded');

// создание дом-элемента с данными из объектов
var createPosterCard = function(similarPoster) {
  var template = document.querySelector('#pin').content.querySelector('.map__pin');
  var posterCard = template.cloneNode(true);

  var positionX = similarPoster.location.x - PIN_WIDTH / 2;
  var positionY = similarPoster.location.y;
  var coordinates = 'left: ' + positionX + 'px; ' + 'top: ' + positionY + 'px;';
  posterCard.style = coordinates;

  var userAvatar = posterCard.querySelector('img');
  userAvatar.src = similarPoster.author.avatar;

  var posterTitle = 'Метка объявления';
  userAvatar.alt = posterTitle;

  return posterCard;
};

//отрисовка дом-элементов в разметку
var renderSimilarPosters = function(similarPosters) {
  var mapPinsBlock = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < similarPosters.length; i++) {
    var similarPoster = similarPosters[i];
    var posterCard = createPosterCard(similarPoster);
    fragment.appendChild(posterCard);
  }

  mapPinsBlock.appendChild(fragment);
};

renderSimilarPosters(similarPosters);
