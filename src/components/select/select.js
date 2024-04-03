import Choices from 'choices.js';

export const initSelcts = () => {
  if (document.querySelector('select')) {
    const selectArr = document.querySelectorAll('select:not(#select-address)');

    selectArr.forEach((item) => {
      const choices = new Choices(item, {
        searchEnabled: false,
        itemSelectText: '',
      });
    });
  }
};
initSelcts();
