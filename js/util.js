'use strict';

(function () {

    var OFFER_TYPES = ['bungalo', 'flat', 'house', 'palace'];
    var SIMILAR_POSTERS_COUNT = 8;
    var MAP_HEIGHT = 630;
    var EMPTY_MAP_SPACE = 130;
    var workspaceHeight = MAP_HEIGHT - EMPTY_MAP_SPACE;
    var map = document.querySelector('.map');
    var mapWidth = map.clientWidth;

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

    window.util = {
        OFFER_TYPES: OFFER_TYPES,
        similarPosters: generateSimilarPosters(),
        mapWidth: mapWidth,
        MAP_HEIGHT: MAP_HEIGHT,
        EMPTY_MAP_SPACE: EMPTY_MAP_SPACE
    };

})();