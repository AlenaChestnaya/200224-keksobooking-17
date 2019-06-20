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

    window.similarPosters = {
        renderSimilarPosters: function(similarPosters) {
            var mapPinsBlock = document.querySelector('.map__pins');
            var fragment = document.createDocumentFragment();
    
            for (var i = 0; i < similarPosters.length; i++) {
                var similarPoster = similarPosters[i];
                var posterCard = createPosterCard(similarPoster);
                fragment.appendChild(posterCard);
            }
    
            mapPinsBlock.appendChild(fragment);
        }
    };
    
})();