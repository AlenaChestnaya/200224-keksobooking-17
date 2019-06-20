'use strict';

var MAP_HEIGHT = 630;
var EMPTY_MAP_SPACE = 130;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var SIMILAR_POSTERS_COUNT = 8;
var OFFER_TYPES = ['bungalo', 'flat', 'house', 'palace'];
var MIN_PRICES_PER_NIGHT = [0, 1000, 5000, 10000];

// создание массива объектов-объявлений
var map = document.querySelector('.map');
var mapWidth = map.clientWidth;
var workspaceHeight = MAP_HEIGHT - EMPTY_MAP_SPACE;

var calcRandom = function(number) {
  return Math.round(Math.random() * number);
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

    var avatarNumber = i + 1;
    similarPoster.author.avatar = 'img/avatars/user0' + avatarNumber + '.png';

    var typeOfOffer = OFFER_TYPES[calcRandom(OFFER_TYPES.length)];
    similarPoster.offer.type = typeOfOffer;

    var positionX = calcRandom(mapWidth);
    var positionY = calcRandom(workspaceHeight) + EMPTY_MAP_SPACE;

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
  form.children[i].disabled = true;
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
    console.log('activated');
  }
}

// для изначального значения поля адреса при загрузке страницы
setAddress();

// связь полей формы Тип жилья и Цена за ночь
var offerTypeSelect = form.querySelector('#type');
var priceInput = form.querySelector('#price');

offerTypeSelect.addEventListener('change', function() {
  var elementIndex = OFFER_TYPES.indexOf(offerTypeSelect.value);

  if (elementIndex !== -1) {
    priceInput.min = MIN_PRICES_PER_NIGHT[elementIndex];
    priceInput.placeholder = MIN_PRICES_PER_NIGHT[elementIndex];
  }
});

// связь полей формы Время заезда и выезда
var timeInInput = form.querySelector('#timein');
var timeOutInput = form.querySelector('#timeout');

timeInInput.addEventListener('change', function() {
  timeOutInput.value = timeInInput.value;
});
timeOutInput.addEventListener('change', function() {
  timeInInput.value = timeOutInput.value;
});

// перемещение главной метки
mainPin.addEventListener('mousedown', function(evt) {
  activatePage();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function(moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mainPinY = (mainPin.offsetTop - shift.y);
    var mainPinX = (mainPin.offsetLeft - shift.x);

    if (mainPinY < EMPTY_MAP_SPACE - PIN_HEIGHT) {
      mainPinY = EMPTY_MAP_SPACE - PIN_HEIGHT;
    } else if (mainPinY > MAP_HEIGHT) {
      mainPinY = MAP_HEIGHT;
    }

    if (mainPinX < -MAIN_PIN_WIDTH / 2) {
      mainPinX = -MAIN_PIN_WIDTH / 2;
    } else if (mainPinX > (mapWidth - MAIN_PIN_WIDTH / 2)) {
      mainPinX = mapWidth - MAIN_PIN_WIDTH / 2;
    }

    mainPin.style.top = mainPinY + 'px';
    mainPin.style.left = mainPinX + 'px';

    setAddress();
  };

  var onMouseUp = function(upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    setAddress();
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
