import Choices from 'choices.js';

export const initAddressSelect = () => {
  if (document.querySelector('#select-address')) {
    const select = document.querySelectorAll('.select-address');
    const currentCity = localStorage.getItem('city');
    const vacanciesCity = document.querySelector(
      '.vacancies-content__top-city span'
    );

    select.forEach((item) => {
      const choices = new Choices(item, {
        searchEnabled: false,
        itemSelectText: '',
      });

      if (currentCity) {
        choices.setValue([currentCity]);
        vacanciesCity.textContent = currentCity;
      }

      choices.passedElement.element.addEventListener(
        'change',
        function (event) {
          localStorage.setItem('city', event.detail.value);
          vacanciesCity.textContent = event.detail.value;
        },
        false
      );
    });
  }
};
initAddressSelect();
