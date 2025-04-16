// protected readonly elements: NodeListOf<HTMLElement>

document
  .querySelector('.navigation__menu')
  ?.addEventListener('click', (e: Event) => {
    e.preventDefault();
    const { target } = e;
    if (!(target as HTMLElement).closest('.navigation__btn')) return;
    const path = (
      (target as HTMLElement).closest('.navigation__btn') as HTMLAnchorElement
    ).href;

    routeHandler(path);
  });

const routeHandler = (path: string) => {
  window.history.pushState({}, '', path);
  if (window.location.pathname === '/favorites') {
    document
      .querySelectorAll<HTMLElement>('.navigation__btn')
      .forEach((btn) => {
        btn.classList.remove('navigation__btn--active');
      });
    (
      document.querySelector("[href='/favorites']") as HTMLElement
    ).classList.add('navigation__btn--active');

    (document.querySelector('.audiolist__title') as HTMLElement).textContent =
      'Избранное';
    (document.querySelector('#app') as HTMLElement).style.display = 'none';
  } else {
    document
      .querySelectorAll<HTMLElement>('.navigation__btn')
      .forEach((btn) => {
        btn.classList.remove('navigation__btn--active');
      });
    (document.querySelector("[href='/']") as HTMLElement).classList.add(
      'navigation__btn--active'
    );
    (document.querySelector('.audiolist__title') as HTMLElement).textContent =
      'Аудиофайлы и треки';
    (document.querySelector('#app') as HTMLElement).style.display = 'block';
  }
  console.log();
};
