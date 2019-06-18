'use strict';

var MAP_HEIGHT = 630;
var EMPTY_MAP_SPACE = 130;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var SIMILAR_POSTERS_COUNT = 8;

// создание массива объектов-объявлений
var map = document.querySelector('.map');
var mapWidth = map.clientWidth;
var workspaceHeight = MAP_HEIGHT - EMPTY_MAP_SPACE;
var typesOfOffer = ['palace', 'flat', 'house', 'bungalo'];
var avatars = [];
for (var i = 1; i <= SIMILAR_POSTERS_COUNT; i++) {
  avatars.push(i);
}

var calcRandomOfArray = function(array) {
  var random = Math.floor(Math.random() * array.length);
  return random;
};
var calcRandomOfDiapason = function(diapason) {
  var random = Math.round(Math.random() * diapason);
  return random;
};

var generateSimilarPosters = function() {
  var similarPosters = [];
  for (var i = 0; i < SIMILAR_POSTERS_COUNT; i++) {
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

    var randomNumber = calcRandomOfArray(avatars);
    var avatarNumber = avatars[randomNumber];
    avatars.splice(randomNumber, 1);

    var userAvatar = 'img/avatars/user0' + avatarNumber + '.png';
    similarPoster.author.avatar = userAvatar;

    var typeOfOffer = typesOfOffer[calcRandomOfArray(typesOfOffer)];
    similarPoster.offer.type = typeOfOffer;

    var positionX = calcRandomOfDiapason(mapWidth);
    var positionY = calcRandomOfDiapason(workspaceHeight) + EMPTY_MAP_SPACE;

    similarPoster.location.x = positionX;
    similarPoster.location.y = positionY;

    similarPosters.push(similarPoster);
  };
  return similarPosters;
};

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

var form = document.querySelector('.ad-form');

for (var i = 0; i < form.children.length; i++) {
  form.children[i].setAttribute('disabled', 'disabled');
}

var map = document.querySelector('.map');
var mainPin = document.querySelector('.map__pin--main');
var isPageActive = false;

// связь координат главной метки со значением поля адреса
var setAddress = function() {
  var addressInput = form.querySelector('#address');

  var mainPinPositionX = parseFloat(mainPin.style.left) + MAIN_PIN_WIDTH / 2;
  var mainPinPositionY;
  if (isPageActive) {
    mainPinPositionY = parseFloat(mainPin.style.top) + PIN_HEIGHT;
  } else {
    mainPinPositionY = parseFloat(mainPin.style.top) + MAIN_PIN_WIDTH / 2;
  }

  addressInput.value = mainPinPositionX + ', ' + mainPinPositionY;
};

// перевод страницы в активный режим

var activatePage = function() {
  if (!isPageActive) {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');

    for (var i = 0; i < form.children.length; i++) {
      form.children[i].removeAttribute('disabled');
    }

    isPageActive = true;
    var similarPosters = generateSimilarPosters();
    renderSimilarPosters(similarPosters);
    setAddress();
  }
}

mainPin.addEventListener('mouseup', activatePage);

// для изначального значения поля адреса при загрузке страницы
setAddress();
