'use strict';

(function () {
    var PIN_HEIGHT = 70;
    var MAIN_PIN_WIDTH = 65;
    var mainPin = document.querySelector('.map__pin--main');
    var isPageActive = false;
    var form = document.querySelector('.ad-form');
    
    // связь координат главной метки со значением поля адреса
    var setAddress = function() {
        var addressInput = form.querySelector('#address');
    
        var mainPinPositionX = Math.floor(parseFloat(mainPin.style.left) + Math.round(MAIN_PIN_WIDTH / 2));
        var mainPinPositionY;
        if (isPageActive) {
            mainPinPositionY = parseFloat(mainPin.style.top) + PIN_HEIGHT;
        } else {
            mainPinPositionY = parseFloat(mainPin.style.top) + MAIN_PIN_WIDTH / 2;
        }
    
        addressInput.value = mainPinPositionX + ', ' + mainPinPositionY;
    };

    // перевод страницы в активный режим
    var map = document.querySelector('.map');

    var activatePage = function() {
        if (!isPageActive) {
            map.classList.remove('map--faded');
            form.classList.remove('ad-form--disabled');

            for (var i = 0; i < form.children.length; i++) {
            form.children[i].removeAttribute('disabled');
            }

            isPageActive = true;
            window.similarPosters.renderSimilarPosters(window.util.similarPosters);
            setAddress();
        }
    }

    // для изначального значения поля адреса при загрузке страницы
    setAddress();

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

            if (mainPinY < window.util.EMPTY_MAP_SPACE - PIN_HEIGHT) {
                mainPinY = window.util.EMPTY_MAP_SPACE - PIN_HEIGHT;
            } else if (mainPinY > window.util.MAP_HEIGHT) {
                mainPinY = window.util.MAP_HEIGHT;
            }

            if (mainPinX < -MAIN_PIN_WIDTH / 2) {
                mainPinX = -MAIN_PIN_WIDTH / 2;
            } else if (mainPinX > (window.util.mapWidth - MAIN_PIN_WIDTH / 2)) {
                mainPinX = window.util.mapWidth - MAIN_PIN_WIDTH / 2;
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


})();