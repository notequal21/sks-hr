export default () => {
  const targetMap = document.querySelector("#map");

  const callbackMap = function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const script = document.createElement("script");
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${targetMap.dataset.key}&lang=ru_RU`;
        document.body.append(script);
        const icon =
          targetMap.dataset.icon !== undefined
            ? targetMap.dataset.icon
            : "../img/icon-map.svg";
        script.addEventListener("load", () => {
          ymaps.ready(init);
          function init() {
            ymaps.ready(function () {
              const myMap = new ymaps.Map(targetMap, {
                center: JSON.parse(targetMap.dataset.center),
                zoom:
                  targetMap.dataset.zoom !== undefined
                    ? targetMap.dataset.zoom
                    : 13,
              });
            });
          }
        });
        observer.unobserve(entry.target);
      }
    });
  };
  var options = {
    rootMargin: "75px 0px 75px 0px",
    threshold: 0,
  };
  if (targetMap) {
    const observer = new IntersectionObserver(callbackMap, options);

    observer.observe(targetMap);
  }
};
// Разметка для карты
//<div class="map"  id="map" data-key="Ваш API ключ" data-center="[55.779324, 37.581623]" data-icon="Ссылка на иконку" ></div>
//
