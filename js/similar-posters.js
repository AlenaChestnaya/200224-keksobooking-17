/* eslint-disable no-invalid-this */
'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PINS_TOTAL = 5;
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
    var renderedPins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < renderedPins.length; i++) {
      mapPinsBlock.removeChild(renderedPins[i]);
    }

    for (var j = 0; j < similarPosters.length; j++) {
      var similarPoster = similarPosters[j];
      var mapPin = createMapPin(similarPoster);
      onPinClick(mapPin, similarPoster);
      fragment.appendChild(mapPin);
    }
    mapPinsBlock.appendChild(fragment);
  };

  var filterForm = document.querySelector('.map__filters');

  // фильтрация похожих объявлений по форме фильтров и максимальному количеству
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
          return poster.offer.price >= 10000 && poster.offer.price <= 50000;
        } else if (priceSelect.value === 'low') {
          return poster.offer.price < 10000;
        } else if (priceSelect.value === 'high') {
          return poster.offer.price > 50000;
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
    hidePosterCard();
    renderSimilarPosters(filteredPosters);
  };

  var filterInputs = filterForm.querySelectorAll('.map__filter');
  var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

  for (var i = 0; i < filterInputs.length; i++) {
    filterInputs[i].addEventListener('change', filterPosters);
  }

  for (var j = 0; j < filterCheckboxes.length; j++) {
    filterCheckboxes[j].addEventListener('change', filterPosters);
  }

  var loadPosters = function (similarPosters) {
    posters = similarPosters;
    console.log(posters);
    filterPosters();
  };

  // получение массива объектов с похожими объявлениями с сервера
  var getSimilarPosters = function () {

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

    window.load('https://js.dump.academy/keksobooking/data', loadPosters, onError);
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

    var offerType = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };

    fillPosterCard('.popup__type', offerType[similarPoster.offer.type]);

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
      for (var k = 0; k < featuresList.children.length; k++) {
        featuresList.children[k].style.display = 'none';
      }
      for (var l = 0; l < similarPoster.offer.features.length; l++) {
        var featureClass = '.popup__feature--' + similarPoster.offer.features[l];
        featuresList.querySelector(featureClass).style.display = 'inline-block';
      }
    }

    // var featuresList = posterCard.querySelector('.popup__features');

    // if (similarPoster.offer.features.length === 0) {
    //   featuresList.style.display = 'none';
    // } else {
    //   for (var j = 0; j < featuresList.children.length; j++) {
    //     var feature = featuresList.children[j];
    //     var isFeatureExist = false;

    //     for (var k = 0; k < similarPoster.offer.features.length; k++) {
    //       var featureClass = 'popup__feature--' + similarPoster.offer.features[k];
    //       if (feature.className.indexOf(featureClass) !== -1) {
    //         isFeatureExist = true;
    //         break;
    //       }
    //     }
    //     if (!isFeatureExist) {
    //       feature.style.display = 'none';
    //     }
    //   }
    // }

    fillPosterCard('.popup__description', similarPoster.offer.description);

    var photos = similarPoster.offer.photos;
    var photosBlock = posterCard.querySelector('.popup__photos');

    if (photos.length > 0) {
      var templatePhoto = posterCard.querySelector('.popup__photo');

      photosBlock.removeChild(templatePhoto);

      for (var m = 0; m < photos.length; m++) {
        var offerPhoto = templatePhoto.cloneNode(true);
        offerPhoto.src = photos[m];
        photosBlock.appendChild(offerPhoto);
      }
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
    cardClose.addEventListener('click', hidePosterCard);

    document.addEventListener('keydown', onPopupEscPress);
  };

  // показывание карточки по клику на метку
  var onPinClick = function (pin, poster) {
    pin.addEventListener('click', function () {
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var k = 0; k < pins.length; k++) {
        pins[k].classList.remove('map__pin--active');
      }

      this.classList.add('map__pin--active');
      hidePosterCard();
      renderPosterCard(poster);
    });
  };

  // удаление карточки похожего объявления
  var hidePosterCard = function () {
    var map = document.querySelector('.map');
    var posterCard = map.querySelector('.map__card');

    if (posterCard) {
      map.removeChild(posterCard);
    }

    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === 27) {
      hidePosterCard();
    }
  };

  window.similarPosters = {
    getSimilarPosters: getSimilarPosters
  };
})();
