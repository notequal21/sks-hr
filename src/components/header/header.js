if (document.querySelector('.header')) {
  const body = document.querySelector('body');
  const header = document.querySelector('.header');
  const headerBurger = header.querySelector('.header-body__burger');

  headerBurger.addEventListener('click', () => {
    if (header.classList.contains('_open')) {
      header.classList.remove('_open');
      body.classList.remove('_lock');
    } else {
      header.classList.add('_open');
      body.classList.add('_lock');
    }
  });
}
