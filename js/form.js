'use strict';

(function () {

  var MIN_PRICES_PER_NIGHT = [0, 1000, 5000, 10000];
  var form = document.querySelector('.ad-form');

  for (var i = 0; i < form.children.length; i++) {
    form.children[i].disabled = true;
  }

  // связь полей формы Тип жилья и Цена за ночь
  var offerTypeSelect = form.querySelector('#type');
  var priceInput = form.querySelector('#price');

  offerTypeSelect.addEventListener('change', function () {
    var elementIndex = window.util.OFFER_TYPES.indexOf(offerTypeSelect.value);

    if (elementIndex !== -1) {
      priceInput.min = MIN_PRICES_PER_NIGHT[elementIndex];
      priceInput.placeholder = MIN_PRICES_PER_NIGHT[elementIndex];
    }
  });

  // связь полей формы Время заезда и выезда
  var timeInInput = form.querySelector('#timein');
  var timeOutInput = form.querySelector('#timeout');

  timeInInput.addEventListener('change', function () {
    timeOutInput.value = timeInInput.value;
  });
  timeOutInput.addEventListener('change', function () {
    timeInInput.value = timeOutInput.value;
  });

})();
