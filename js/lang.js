/**
 * PETROGANSO - CLIENT-SIDE LANGUAGE SWITCHER (ES / EN)
 * Seamless, instantaneous language toggling with persistent state.
 */

(function () {
  const STORAGE_KEY = 'petroganso_lang';

  function getCurrentLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'es' || saved === 'en')) {
      return saved;
    }
    // Default to Spanish
    return 'es';
  }

  function applyLanguage(lang) {
    if (!translations || !translations[lang]) return;

    const dict = translations[lang];

    // 1. Update textContent of data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // 2. Update placeholders of inputs/textareas
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 3. Update document html lang attribute
    document.documentElement.lang = lang;

    // 4. Update language switcher buttons active state
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 5. Save preference
    localStorage.setItem(STORAGE_KEY, lang);

    // 6. Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('petrogansoLangChange', { detail: { lang } }));
  }

  window.setSiteLanguage = function (lang) {
    applyLanguage(lang);
  };

  window.getSiteLanguage = function () {
    return getCurrentLanguage();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getCurrentLanguage();
    applyLanguage(initialLang);

    // Attach click events to language buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = btn.getAttribute('data-lang');
        applyLanguage(selectedLang);
      });
    });
  });
})();
