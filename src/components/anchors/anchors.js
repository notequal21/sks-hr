export const anchors = () => {
  const anchors = document.querySelectorAll('a[href*="#"]');
  const body = document.querySelector('body');
  const header = document.querySelector('.header');

  for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      body.classList.remove('_lock');
      header.classList.remove('_open');

      const blockID = anchor.getAttribute('href').substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }
};
anchors();
