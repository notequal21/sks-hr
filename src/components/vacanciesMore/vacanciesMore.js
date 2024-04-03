if (document.querySelector('.vacancies-content__row')) {
  const btnMore = document.querySelector('.vacancies-content__more');
  const btnMoreDefaultText = btnMore.textContent;
  const vacanciesList = document.querySelectorAll(
    '.vacancies-content__row._hidden'
  );

  if (vacanciesList.length <= 0) {
    btnMore.classList.add('_hidden');
  }

  btnMore.addEventListener('click', () => {
    if (btnMore.classList.contains('_open')) {
      btnMore.classList.remove('_open');
      btnMore.innerHTML = btnMoreDefaultText;

      vacanciesList.forEach((item) => item.classList.remove('_show'));
    } else {
      btnMore.classList.add('_open');
      btnMore.innerHTML = 'Показать меньше';

      vacanciesList.forEach((item) => item.classList.add('_show'));
    }
  });
}
