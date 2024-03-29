'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PINS_TOTAL = 5;
  var DEBOUNCE_INTERVAL = 500;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var OfferType = {
    'FLAT': 'Квартира',
    'BUNGALO': 'Бунгало',
    'HOUSE': 'Дом',
    'PALACE': 'Дворец'
  };
  var posters = [];

  // создание дом-элемента метки похожего объявления с данными из объектов
  var createMapPin = function (similarPoster) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var mapPin = template.cloneNode(true);

    var positionX = similarPoster.location.x - PIN_WIDTH / 2;
    var positionY = similarPoster.location.y;
    var coordinates = 'left: ' + positionX + 'px; ' + 'top: ' + positionY + 'px;';
    mapPin.style = coordinates;

    var userAvatar = mapPin.querySelector('img');
    userAvatar.src = similarPoster.author.avatar;

    userAvatar.alt = similarPoster.offer.title;
    return mapPin;
  };

  // отрисовка дом-элементов с данными из объектов
  var renderSimilarPosters = function (similarPosters) {
    var mapPinsBlock = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    window.util.removePins();

    similarPosters.forEach(function (similarPoster) {
      var mapPin = createMapPin(similarPoster);
      addPinClickListener(mapPin, similarPoster);
      fragment.appendChild(mapPin);
    });

    mapPinsBlock.appendChild(fragment);
  };

  // фильтрация похожих объявлений по форме фильтров и максимальному количеству
  var filterForm = document.querySelector('.map__filters');
  var lastTimeout;
  var filterPosters = function () {
    var filteredPosters = posters.slice();

    // проверка типа жилья
    var typeSelect = filterForm.querySelector('#housing-type');
    if (typeSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.type === typeSelect.value;
      });
    }

    // проверка стоимости аренды
    var priceSelect = filterForm.querySelector('#housing-price');

    if (priceSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        if (priceSelect.value === 'middle') {
          return poster.offer.price >= LOW_PRICE && poster.offer.price <= HIGH_PRICE;
        } else if (priceSelect.value === 'low') {
          return poster.offer.price < LOW_PRICE;
        } else if (priceSelect.value === 'high') {
          return poster.offer.price > HIGH_PRICE;
        } else {
          return false;
        }
      });
    }

    // проверка числа комнат
    var roomsSelect = filterForm.querySelector('#housing-rooms');
    if (roomsSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.rooms === parseInt(roomsSelect.value, 10);
      });
    }

    // проверка числа гостей
    var guestsSelect = filterForm.querySelector('#housing-guests');
    if (guestsSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.guests === parseInt(guestsSelect.value, 10);
      });
    }

    // проверка наличия удобств
    var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

    for (var i = 0; i < filterCheckboxes.length; i++) {
      if (filterCheckboxes[i].checked) {
        filteredPosters = filteredPosters.filter(function (poster) {
          return poster.offer.features.indexOf(filterCheckboxes[i].value) !== -1;
        });
      }
    }

    filteredPosters = filteredPosters.slice(0, PINS_TOTAL);
    window.util.hidePosterCard();

    // устранение дребезга
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      renderSimilarPosters(filteredPosters);
    }, DEBOUNCE_INTERVAL);
  };

  var filterInputs = filterForm.querySelectorAll('.map__filter');
  var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

  for (var i = 0; i < filterInputs.length; i++) {
    filterInputs[i].addEventListener('change', function () {
      filterPosters();
    });
  }

  for (var j = 0; j < filterCheckboxes.length; j++) {
    filterCheckboxes[j].addEventListener('change', function () {
      filterPosters();
    });
  }

  window.util.disableFilters();

  var loadPosters = function (similarPosters) {
    similarPosters = similarPosters.filter(function (poster) {
      return poster.offer;
    });
    posters = similarPosters;
    filterPosters();
  };

  // получение массива объектов с похожими объявлениями с сервера
  var getList = function () {

    var onError = function () {
      var template = document.querySelector('#error').content.querySelector('.error');
      var errorMessage = template.cloneNode(true);

      var errorText = errorMessage.querySelector('.error__message');
      errorText.textContent = 'Ошибка загрузки похожих объявлений';

      var main = document.querySelector('main');
      main.appendChild(errorMessage);
      var errorClose = errorMessage.querySelector('.error__button');
      errorClose.textContent = 'Закрыть';
      errorClose.addEventListener('click', function () {
        main.removeChild(errorMessage);
      });
    };

    window.xhr.load(LOAD_URL, loadPosters, onError);
  };

  // создание подробной карточки похожего объявления

  // создание дом-элемента карточки похожего объявления с данными из объектов
  var createPosterCard = function (similarPoster) {
    var template = document.querySelector('#card').content.querySelector('.map__card');
    var posterCard = template.cloneNode(true);

    var fillPosterCard = function (tag, data) {
      var elem = posterCard.querySelector(tag);
      if (elem) {
        if (!data) {
          elem.style.display = 'none';
        } else {
          elem.textContent = data;
        }
      }
    };

    fillPosterCard('.popup__title', similarPoster.offer.title);
    fillPosterCard('.popup__text--address', similarPoster.offer.address);

    var priceField = posterCard.querySelector('.popup__text--price');
    priceField.firstChild.nodeValue = similarPoster.offer.price + '₽';

    fillPosterCard('.popup__type', OfferType[similarPoster.offer.type]);

    if (!similarPoster.offer.rooms || !similarPoster.offer.guests) {
      posterCard.querySelector('.popup__text--capacity').style.display = 'none';
    } else {
      fillPosterCard('.popup__text--capacity', similarPoster.offer.rooms + ' комнаты для ' + similarPoster.offer.guests + ' гостей');
    }

    fillPosterCard('.popup__text--time', 'Заезд после ' + similarPoster.offer.checkin + ', выезд до ' + similarPoster.offer.checkout);

    var featuresList = posterCard.querySelector('.popup__features');
    if (similarPoster.offer.features.length === 0) {
      featuresList.style.display = 'none';
    } else {
      for (var l = 0; l < featuresList.children.length; l++) {
        featuresList.children[l].style.display = 'none';
      }
      similarPoster.offer.features.forEach(function (feature) {
        var featureClass = '.popup__feature--' + feature;
        featuresList.querySelector(featureClass).style.display = 'inline-block';
      });
    }

    fillPosterCard('.popup__description', similarPoster.offer.description);

    var photos = similarPoster.offer.photos;
    var photosBlock = posterCard.querySelector('.popup__photos');

    if (photos.length > 0) {
      var templatePhoto = posterCard.querySelector('.popup__photo');

      photosBlock.removeChild(templatePhoto);

      photos.forEach(function (photo) {
        var offerPhoto = templatePhoto.cloneNode(true);
        offerPhoto.src = photo;
        photosBlock.appendChild(offerPhoto);
      });
    } else {
      photosBlock.style.display = 'none';
    }

    posterCard.querySelector('.popup__avatar').src = similarPoster.author.avatar;

    return posterCard;
  };

  // отрисовка карточки похожего объявления с данными из объектов
  var renderPosterCard = function (similarPoster) {
    var map = document.querySelector('.map');
    var mapFilters = map.querySelector('.map__filters-container');
    var fragment = document.createDocumentFragment();
    var posterCard = createPosterCard(similarPoster);

    fragment.appendChild(posterCard);
    map.insertBefore(fragment, mapFilters);

    var cardClose = document.querySelector('.map__card .popup__close');
    cardClose.addEventListener('click', function () {
      window.util.hidePosterCard();
    });

    document.addEventListener('keydown', window.util.onPopupEscPress);
  };

  // показывание карточки по клику на метку
  var addPinClickListener = function (pin, poster) {
    pin.addEventListener('click', function () {
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var l = 0; l < pins.length; l++) {
        pins[l].classList.remove('map__pin--active');
      }
      pin.classList.add('map__pin--active');
      window.util.hidePosterCard();
      renderPosterCard(poster);
    });
  };

  window.similarPosters = {
    getList: getList
  };
})();
