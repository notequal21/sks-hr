/*
Документация слайдера: https://swiperjs.com/
*/

import Swiper from 'swiper';
import { A11y, Navigation, Pagination } from 'swiper/modules';
/*
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
*/

import '../../scss/base/swiper.scss';
// import "../../scss/libs/swiper.scss";
// import 'swiper/css';
export const createSlider = (el, options) => {
  let mergedOptions;
  const defaultOptions = {
    modules: [A11y],
    slidesPerView: 'auto',
    speed: 800,
    a11y: true,
  };

  if (options && typeof options === 'object') {
    mergedOptions = { ...defaultOptions, ...options };
    if (options.modules) {
      mergedOptions.modules = [
        ...new Set([...defaultOptions.modules, ...options.modules]),
      ];
    }
  }
  sliders.push([el, mergedOptions || defaultOptions]);
};

const sliders = [];
// Инициализация слайдеров
function initSliders() {
  // Список слайдеров
  // Проверяем, есть ли слайдер на странице
  console.log(sliders);
  sliders.forEach((element) => {
    new Swiper(element[0], element[1]);
  });
}

window.addEventListener('load', function (e) {
  initSliders();
});

// Бинд слайдеров на window для беков
window.initSliders = initSliders;

createSlider('.gallery-body .gallery-body__slider', {
  modules: [Navigation, Pagination],
  autoHeight: true,
  loop: true,
  navigation: {
    prevEl: '.gallery-body .gallery-slider-prev',
    nextEl: '.gallery-body .gallery-slider-next',
  },
  pagination: {
    el: '.gallery-body .gallery-body__pagination',
    clickable: true,
  },
});
createSlider('.team-body .gallery-body__slider', {
  modules: [Navigation, Pagination],
  autoHeight: true,
  spaceBetween: 20,
  navigation: {
    prevEl: '.team-body .team-slider-prev',
    nextEl: '.team-body .team-slider-next',
  },
  pagination: {
    el: '.team-body .gallery-body__pagination',
    clickable: true,
  },
});
