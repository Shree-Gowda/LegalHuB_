(function () {
  const THEME_KEY = 'lhb_theme';
  const root = document.documentElement; // <html>
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
  const iconSpan = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;

  function applyTheme(theme) {
    // Use a class on <html> for CSS variable overrides
    if (theme === 'dark') {
      root.classList.add('theme-dark');
      localStorage.setItem(THEME_KEY, 'dark');
      if (iconSpan) iconSpan.textContent = '☀️';
      body.style.colorScheme = 'dark';
    } else {
      root.classList.remove('theme-dark');
      localStorage.setItem(THEME_KEY, 'light');
      if (iconSpan) iconSpan.textContent = '🌙';
      body.style.colorScheme = 'light';
    }
  }

  // Initialize: read preference from localStorage or system
  let initial = localStorage.getItem(THEME_KEY);
  if (!initial) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    initial = prefersDark ? 'dark' : 'light';
  }
  applyTheme(initial);

  // Toggle handler
  toggleBtn && toggleBtn.addEventListener('click', function () {
    const current = root.classList.contains('theme-dark') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();


