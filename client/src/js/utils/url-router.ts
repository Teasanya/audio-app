type Route = {
  path: string;
  title: string;
  showApp: boolean;
};

const ROUTES: Record<string, Route> = {
  '/': {
    path: '/',
    title: 'Аудиофайлы и треки',
    showApp: true,
  },
  '/favorites': {
    path: '/favorites',
    title: 'Избранное',
    showApp: false,
  },
};

document
  .querySelector('.navigation__menu')
  ?.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('.navigation__btn') as HTMLAnchorElement | null;

    if (!btn) return;

    e.preventDefault();
    navigateTo(btn.href);
  });

function navigateTo(path: string) {
  const url = new URL(path, window.location.origin);
  const route = ROUTES[url.pathname] || ROUTES['/'];

  window.history.pushState({ path: url.pathname }, '', url.pathname);
  updateUI(route);
}

function updateUI(route: Route) {
  (document.querySelector('.audiolist__title') as HTMLElement).textContent =
    route.title;

  document.querySelectorAll('.navigation__btn').forEach((btn) => {
    btn.classList.toggle(
      'navigation__btn--active',
      btn.getAttribute('href') === route.path
    );
  });
}

window.addEventListener('popstate', (e) => {
  const path = e.state?.path || '/';
  const route = ROUTES[path] || ROUTES['/'];
  updateUI(route);
});

const initialPath = window.location.pathname;
navigateTo(initialPath);
