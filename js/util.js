'use strict';

(function () {

  var OFFER_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var MAP_HEIGHT = 630;
  var EMPTY_MAP_SPACE = 130;
  var map = document.querySelector('.map');
  var mapWidth = map.clientWidth;

  window.util = {
    OFFER_TYPES: OFFER_TYPES,
    mapWidth: mapWidth,
    MAP_HEIGHT: MAP_HEIGHT,
    EMPTY_MAP_SPACE: EMPTY_MAP_SPACE
  };

})();
