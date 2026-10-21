/**
 * PETROGANSO ENERGY & COMMODITIES
 * Main Client-side Script with International Benchmarks
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMarketTicker();
  initProductTabs();
  initScrollAnimations();
  initVideoControls();
});

/* --------------------------------------------------------------------------
   STICKY NAVBAR & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const headerWrapper = document.querySelector('.header-wrapper');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      headerWrapper?.classList.add('header-scrolled');
    } else {
      headerWrapper?.classList.remove('header-scrolled');
    }
  });

  if (window.scrollY > 30) {
    headerWrapper?.classList.add('header-scrolled');
  }

  // Mobile menu setup with backdrop & drawer close button
  if (mobileToggle && navMenu) {
    // 1. Ensure backdrop element exists
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    // 2. Ensure drawer header with close button exists inside navMenu
    if (!navMenu.querySelector('.nav-drawer-header')) {
      const drawerHeader = document.createElement('div');
      drawerHeader.className = 'nav-drawer-header';
      drawerHeader.innerHTML = `
        <img src="assets/images/logo.svg" alt="Petroganso" height="26">
        <button type="button" class="nav-drawer-close" id="mobileDrawerClose" aria-label="Cerrar menú">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      navMenu.insertBefore(drawerHeader, navMenu.firstChild);

      drawerHeader.querySelector('.nav-drawer-close')?.addEventListener('click', closeMenu);
    }

    function openMenu() {
      navMenu.classList.add('open');
      mobileToggle.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navMenu.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
}

/* --------------------------------------------------------------------------
   INTERNATIONAL BENCHMARKS MARKET TICKER
   -------------------------------------------------------------------------- */
function initMarketTicker() {
  // Pure international energy commodities benchmarks
  const tickerData = [
    { name: 'BRENT (ICE)', price: 74.85, unit: '/bbl', change: '+0.82%', up: true },
    { name: 'WTI (NYMEX)', price: 70.40, unit: '/bbl', change: '+0.65%', up: true },
    { name: 'GASOIL (ICE 0.1%)', price: 682.50, unit: '/mt', change: '+1.10%', up: true },
    { name: 'JET FUEL GLOBAL', price: 85.30, unit: '/bbl', change: '+0.75%', up: true },
    { name: 'HENRY HUB GAS', price: 2.82, unit: '/MMBtu', change: '-0.45%', up: false },
    { name: 'RBOB GASOLINE', price: 2.14, unit: '/gal', change: '+0.90%', up: true },
    { name: 'FUEL OIL 380 CST', price: 435.00, unit: '/mt', change: '-0.30%', up: false }
  ];

  const scrollContainer = document.querySelector('.ticker-scroll');
  if (!scrollContainer) return;

  function renderTicker() {
    // Duplicate items to enable seamless endless CSS scroll loop
    const fullList = [...tickerData, ...tickerData];
    scrollContainer.innerHTML = fullList.map(item => `
      <div class="ticker-item">
        <span class="symbol">${item.name}:</span>
        <span class="price">$${item.price.toFixed(2)}${item.unit}</span>
        <span class="${item.up ? 'change-up' : 'change-down'}">
          ${item.up ? '▲' : '▼'} ${item.change}
        </span>
      </div>
    `).join('');
  }

  renderTicker();

  // Subtle live price fluctuation simulation
  setInterval(() => {
    tickerData.forEach(item => {
      const delta = (Math.random() - 0.48) * 0.12;
      item.price = Math.max(1, item.price + delta);
    });
    renderTicker();
  }, 12000);
}

/* --------------------------------------------------------------------------
   PRODUCT CATEGORY TABS FILTER
   -------------------------------------------------------------------------- */
function initProductTabs() {
  const tabs = document.querySelectorAll('.tab-btn[data-category]');
  const cards = document.querySelectorAll('.product-card-item');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-category');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (targetCategory === 'all' || category === targetCategory) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   SMOOTH SCROLL & INTERSECTION OBSERVER ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.glass-card, .compliance-card, .hub-visual-card, .video-container').forEach(el => {
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   INTERACTIVE VIDEO CONTROLS
   -------------------------------------------------------------------------- */
function initVideoControls() {
  const video = document.getElementById('logisticsVideo');
  const btn = document.getElementById('btnToggleVideo');
  const iconPause = document.getElementById('iconPause');
  const iconPlay = document.getElementById('iconPlay');

  if (!video || !btn) return;

  btn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      if (iconPause) iconPause.style.display = 'block';
      if (iconPlay) iconPlay.style.display = 'none';
      btn.setAttribute('aria-label', 'Pausar Video');
    } else {
      video.pause();
      if (iconPause) iconPause.style.display = 'none';
      if (iconPlay) iconPlay.style.display = 'block';
      btn.setAttribute('aria-label', 'Reproducir Video');
    }
  });
}

