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
      onMapPinClick(mapPin, similarPoster);
      fragment.appendChild(mapPin);
    }
    mapPinsBlock.appendChild(fragment);
  };

  // показывание карточки по клику на метку
  var onMapPinClick = function (pin, poster) {
    pin.addEventListener('click', function () {
      var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var i = 0; i < pins.length; i++) {
        pins[i].classList.remove('map__pin--active');
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
  };

  var filterForm = document.querySelector('.map__filters');

  // фильтрация похожих объявлений по форме фильтров и максимальному количеству
  var filterPosters = function () {
    var filteredPosters = posters.slice();
    var typeSelect = filterForm.querySelector('#housing-type');

    if (typeSelect.value !== 'any') {
      filteredPosters = filteredPosters.filter(function (poster) {
        return poster.offer.type === typeSelect.value;
      });
    }
    filteredPosters = filteredPosters.slice(0, PINS_TOTAL);
    hidePosterCard();
    renderSimilarPosters(filteredPosters);
  };

  var filterInputs = filterForm.querySelectorAll('select');

  for (var i = 0; i < filterInputs.length; i++) {
    filterInputs[i].addEventListener('change', filterPosters);
  }

  var loadPosters = function (similarPosters) {
    posters = similarPosters;
    filterPosters();
    console.log(posters);
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

  // создание подробной карточки похожего объявления - создать новый модуль

  // создание дом-элемента карточки похожего объявления с данными из объектов
  var createPosterCard = function (similarPoster) {
    var template = document.querySelector('#card').content.querySelector('.map__card');
    var posterCard = template.cloneNode(true);

    // var positionX = similarPoster.location.x - PIN_WIDTH / 2;
    // var positionY = similarPoster.location.y;
    // var coordinates = 'left: ' + positionX + 'px; ' + 'top: ' + positionY + 'px;';
    // posterCard.style = coordinates;

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

    // пристроить проверки на неполученные данные с сервера при каждом вызове функции заполнения поля карточки
    fillPosterCard('.popup__title', similarPoster.offer.title);

    fillPosterCard('.popup__text--address', similarPoster.offer.address);

    var priceField = posterCard.querySelector('.popup__text--price');
    priceField.firstChild.nodeValue = similarPoster.offer.price + '₽';

    // проверить правильное именование словаря и кавычки

    var offerType = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };

    fillPosterCard('.popup__type', offerType[similarPoster.offer.type]);
    fillPosterCard('.popup__text--capacity', similarPoster.offer.rooms + ' комнаты для ' + similarPoster.offer.guests + ' гостей');
    fillPosterCard('.popup__text--time', 'Заезд после ' + similarPoster.offer.checkin + ', выезд до ' + similarPoster.offer.checkout);

    var featuresList = posterCard.querySelector('.popup__features');
    if (similarPoster.offer.features.length === 0) {
      featuresList.style.display = 'none';
    } else {
      for (var j = 0; j < featuresList.children.length; j++) {
        featuresList.children[j].style.display = 'none';
      }
      for (var k = 0; k < similarPoster.offer.features.length; k++) {
        var featureClass = '.popup__feature--' + similarPoster.offer.features[k];
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

      for (var l = 0; l < photos.length; l++) {
        var offerPhoto = templatePhoto.cloneNode(true);
        offerPhoto.src = photos[l];
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
    var mapCardsBlock = document.querySelector('.map');
    var mapFilters = mapCardsBlock.querySelector('.map__filters-container');
    var fragment = document.createDocumentFragment();
    var posterCard = createPosterCard(similarPoster);

    fragment.appendChild(posterCard);
    mapCardsBlock.insertBefore(fragment, mapFilters);
  };

  window.similarPosters = {
    getSimilarPosters: getSimilarPosters
  };
})();
