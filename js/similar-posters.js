'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PINS_TOTAL = 5;
  var posters = [];

  // создание дом-элемента с данными из объектов
  var createPosterCard = function (similarPoster) {
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

  var renderSimilarPosters = function (similarPosters) {
    var mapPinsBlock = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    var renderedPins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < renderedPins.length; i++) {
      mapPinsBlock.removeChild(renderedPins[i]);
    }

    for (var j = 0; j < similarPosters.length; j++) {
      var similarPoster = similarPosters[j];
      var posterCard = createPosterCard(similarPoster);
      fragment.appendChild(posterCard);
    }
    mapPinsBlock.appendChild(fragment);
  };

  var filterForm = document.querySelector('.map__filters');

  var filterPosters = function () {
    var filteredPosters = posters.slice();
    var typeSelect = filterForm.querySelector('#housing-type');

    if (typeSelect.value !== 'any') {
      filteredPosters = filteredPosters
        .filter(function (poster) {
          return poster.offer.type === typeSelect.value;
        });
    }
    filteredPosters = filteredPosters.slice(0, PINS_TOTAL);
    renderSimilarPosters(filteredPosters);
  };

  var filterInputs = filterForm.querySelectorAll('select');

  for (var i = 0; i < filterInputs.length; i++) {
    filterInputs[i].addEventListener('change', filterPosters);
  }

  var loadPosters = function (similarPosters) {
    posters = similarPosters;
    filterPosters();
  };

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

  window.similarPosters = {
    getSimilarPosters: getSimilarPosters
  };
})();
