/**
 * PETROGANSO ENERGY & COMMODITIES
 * Main Client-side Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMarketTicker();
  initProductTabs();
  initScrollAnimations();
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
    if (window.scrollY > 40) {
      headerWrapper?.classList.add('header-scrolled');
    } else {
      headerWrapper?.classList.remove('header-scrolled');
    }
  });

  // Trigger once on load
  if (window.scrollY > 40) {
    headerWrapper?.classList.add('header-scrolled');
  }

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking outside or clicking any link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   DYNAMIC MARKET TICKER
   -------------------------------------------------------------------------- */
function initMarketTicker() {
  const tickerData = [
    { name: 'BRENT CRUDE', price: 79.45, change: '+1.18%', up: true },
    { name: 'WTI CRUDE', price: 75.30, change: '+0.94%', up: true },
    { name: 'ULSD DIESEL (USGC)', price: 2.38, unit: '/gal', change: '+1.42%', up: true },
    { name: 'VLSFO 0.5% (PANAMA)', price: 618.50, unit: '/mt', change: '-0.35%', up: false },
    { name: 'MGO 0.1% (BALBOA)', price: 785.00, unit: '/mt', change: '+0.45%', up: true },
    { name: 'JET A-1 FUEL', price: 88.20, unit: '/bbl', change: '+0.80%', up: true },
    { name: 'CANAL TRANSIT INDEX', price: 104.2, change: '+2.1%', up: true },
    { name: 'USD / EUR', price: 1.085, change: '-0.12%', up: false }
  ];

  const scrollContainer = document.querySelector('.ticker-scroll');
  if (!scrollContainer) return;

  function renderTicker() {
    // Duplicate array to enable seamless endless CSS scroll loop
    const fullList = [...tickerData, ...tickerData];
    scrollContainer.innerHTML = fullList.map(item => `
      <div class="ticker-item">
        <span class="symbol">${item.name}:</span>
        <span class="price">$${item.price.toFixed(2)}${item.unit || '/bbl'}</span>
        <span class="${item.up ? 'change-up' : 'change-down'}">
          ${item.up ? '▲' : '▼'} ${item.change}
        </span>
      </div>
    `).join('');
  }

  renderTicker();

  // Gentle micro-variation every 15 seconds to give alive institutional feel
  setInterval(() => {
    tickerData.forEach(item => {
      const delta = (Math.random() - 0.48) * 0.15;
      item.price = Math.max(1, item.price + delta);
    });
    renderTicker();
  }, 15000);
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
  }, { threshold: 0.15 });

  document.querySelectorAll('.glass-card, .compliance-card, .hub-visual-card').forEach(el => {
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}
