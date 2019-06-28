'use strict';

(function () {
  var PIN_WIDTH = 50;

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

  var renderSimilarPosters = function(similarPosters) {
    var mapPinsBlock = document.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < similarPosters.length; i++) {
      var similarPoster = similarPosters[i];
      var posterCard = createPosterCard(similarPoster);
      fragment.appendChild(posterCard);
    }

    mapPinsBlock.appendChild(fragment);
  }

  var getSimilarPosters = function() {

    var onError = function (message) {
      console.error(message);
      var template = document.querySelector('#error').content.querySelector('.error');
      var errorMessage = template.cloneNode(true);

      var errorText = errorMessage.querySelector('.error__message');
      errorText.textContent = 'Ошибка загрузки похожих объявлений';

      var main = document.querySelector('main');
      main.appendChild(errorMessage);
      var errorClose = errorMessage.querySelector('.error__button');
      errorClose.textContent = 'Закрыть';
      errorClose.addEventListener('click', function() {
        main.removeChild(errorMessage);
      });
    };

    window.load('https://js.dump.academy/keksobooking/data', renderSimilarPosters, onError);
  };

  window.similarPosters = {
    getSimilarPosters: getSimilarPosters
  };

})();
