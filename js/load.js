'use strict';

(function () {
  window.load = function (url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';  // приводит текст ответа с сервера в объект

    xhr.addEventListener('load', function () {    // действие, которое сработает, когда сервер вернет ответ
      if (xhr.status === 200) {
        onSuccess(xhr.response);  // текст ответа - данные - в виде массива объектов
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);   // код ответа - ок или 404
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', url);  // как и куда мы хотим обратиться
    xhr.send(); // для отправки запроса запускаем его
  }
})();
