'use strict';

(function () {

  var OFFER_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var MAP_HEIGHT = 630;
  var EMPTY_MAP_SPACE = 130;
  var ESC_CODE = 27;
  var map = document.querySelector('.map');
  var mapWidth = map.clientWidth;
  var isPageActive = false;
  var form = document.querySelector('.ad-form');

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      hidePosterCard();
    }
  };

  // удаление меток похожих объявлений с карты
  var removePins = function () {
    var mapPinsBlock = document.querySelector('.map__pins');
    var renderedPins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < renderedPins.length; i++) {
      mapPinsBlock.removeChild(renderedPins[i]);
    }
  };

  // дезактивирует форму фильтров объявлений
  var disableFilters = function () {
    var filterForm = document.querySelector('.map__filters');

    for (var i = 0; i < filterForm.children.length; i++) {
      filterForm.children[i].disabled = true;
    }
  };

  // дезактивирует форму создания объявлений
  var disableForm = function () {
    for (var i = 0; i < form.children.length; i++) {
      form.children[i].disabled = true;
    }
  };

  // удаление подробной карточки похожего объявления
  var hidePosterCard = function () {
    var posterCard = map.querySelector('.map__card');

    if (posterCard) {
      map.removeChild(posterCard);
    }

    document.removeEventListener('keydown', onPopupEscPress);
  };

  // приводит страницу в изначальное неактивное состояние
  var desactivatePage = function () {
    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    window.util.isPageActive = false;
    removePins();
    hidePosterCard();
    disableForm();
    window.form.resetForm();
    window.mainPin.resetMainPinPosition();
  };

  window.util = {
    OFFER_TYPES: OFFER_TYPES,
    mapWidth: mapWidth,
    MAP_HEIGHT: MAP_HEIGHT,
    EMPTY_MAP_SPACE: EMPTY_MAP_SPACE,
    desactivatePage: desactivatePage,
    removePins: removePins,
    disableFilters: disableFilters,
    isPageActive: isPageActive,
    disableForm: disableForm,
    hidePosterCard: hidePosterCard,
    onPopupEscPress: onPopupEscPress
  };

})();
