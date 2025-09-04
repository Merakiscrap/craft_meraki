// ==========================
// Load menu and footer
// ==========================
fetch('components/menu.html')
  .then(resp => resp.text())
  .then(data => {
    document.getElementById('menu-container').innerHTML = data;
  })
  .then(() => initMenuAndLang());

fetch('components/footer.html')
  .then(resp => resp.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  });

// ==========================
// Initialize menu behaviors + language switch
// ==========================
function initMenuAndLang() {
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo img');
  const nav = document.querySelector('nav');
  const menuLinks = document.querySelectorAll('nav ul li a');
  const langSwitch = document.getElementById('langSwitch');

  const mobileBreakpoint = 768;
  let lastScroll = 0;

  // ==========================
  // Mobile scroll hide
  // ==========================
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= mobileBreakpoint && header) {
      const currentScroll = window.pageYOffset;
      header.style.top = currentScroll > lastScroll ? `-${header.offsetHeight}px` : '0';
      lastScroll = currentScroll;
    }
  });

  // ==========================
  // Desktop hover menu
  // ==========================
  if (window.innerWidth > mobileBreakpoint && logo && nav) {
    logo.addEventListener('mouseenter', () => nav.classList.add('open'));
    nav.addEventListener('mouseleave', () => nav.classList.remove('open'));
  }

  // ==========================
  // Mobile click menu toggle
  // ==========================
  if (logo && nav) {
    logo.addEventListener('click', e => {
      if (window.innerWidth <= mobileBreakpoint) {
        e.preventDefault();
        nav.classList.toggle('open');
      }
    });
  }

  // ==========================
  // Close menu on link click (mobile)
  // ==========================
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= mobileBreakpoint && nav) nav.classList.remove('open');
    });
  });

  // ==========================
  // Language switch
  // ==========================
  if (langSwitch) {
    let currentLang = 'fr'; // default
    const pageId = document.body.dataset.page; // e.g., "index" or "contact"

    const updateContent = (lang) => {
      fetch(`assets/translations/content-${lang}.json`)
        .then(resp => resp.json())
        .then(data => {
          if (pageId && data[pageId]) {
            const pageContent = data[pageId];
            for (const key in pageContent) {
              const el = document.getElementById(key);
              if (el) el.innerHTML = pageContent[key];
            }
          }
        });
    };

    // Initial content load
    updateContent(currentLang);

    langSwitch.addEventListener('click', e => {
      e.preventDefault();
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      langSwitch.innerText = currentLang === 'fr' ? 'EN' : 'FR';
      updateContent(currentLang);
    });
  }
}
