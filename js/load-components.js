// ==========================
// Load menu and footer
// ==========================
Promise.all([
  fetch('components/menu.html').then(r => r.text()),
  fetch('components/footer.html').then(r => r.text())
]).then(([menuHTML, footerHTML]) => {
  document.getElementById('menu-container').innerHTML = menuHTML;
  document.getElementById('footer-container').innerHTML = footerHTML;
  initMenuAndLang();
});

// ==========================
// Initialize menu + language switch
// ==========================
function initMenuAndLang() {
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo img');
  const nav = document.querySelector('nav');
  const menuLinks = document.querySelectorAll('nav ul li a');
  const langSwitch = document.getElementById('langSwitch');
  const pageId = document.body.dataset.page;
  const mobileBreakpoint = 768;
  let lastScroll = 0;

  // === Mobile scroll hide ===
  window.addEventListener('scroll', () => {
    if (header && window.innerWidth <= mobileBreakpoint) {
      const currentScroll = window.pageYOffset;
      header.style.top = currentScroll > lastScroll ? `-${header.offsetHeight}px` : '0';
      lastScroll = currentScroll;
    }
  });

  // === Desktop hover menu ===
  if (logo && nav && window.innerWidth > mobileBreakpoint) {
    logo.addEventListener('mouseenter', () => nav.classList.add('open'));
    nav.addEventListener('mouseleave', () => nav.classList.remove('open'));
  }

  // === Mobile click toggle ===
  if (logo && nav) {
    logo.addEventListener('click', e => {
      if (window.innerWidth <= mobileBreakpoint) {
        e.preventDefault();
        nav.classList.toggle('open');
      }
    });
  }

  // === Close menu on mobile link click ===
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= mobileBreakpoint && nav) nav.classList.remove('open');
    });
  });

  // === Language switch ===
  if (!langSwitch || !pageId) return;
  let currentLang = 'fr';

  const updateContent = lang => {
    fetch(`assets/translations/content-${lang}.json`)
      .then(resp => resp.json())
      .then(data => {
        const pageContent = data[pageId];
        if (!pageContent) return;

        for (const key in pageContent) {
          const el = document.getElementById(key);
          if (!el) continue;

          // If previewOffers, build circles
          if (key === 'previewOffers') {
            el.innerHTML = '';
            pageContent.previewOffers.forEach(offer => {
              const circle = document.createElement('a');
              circle.href = offer.link;
              circle.className = 'circle';
              circle.innerHTML = `<span class="title">${offer.title}</span><span class="subtitle">${offer.text}</span>`;
              el.appendChild(circle);
            });
          } else {
            el.innerHTML = pageContent[key];
          }
        }
      });
  };

  // Initial load
  updateContent(currentLang);

  // Switch on click
  langSwitch.addEventListener('click', e => {
    e.preventDefault();
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    langSwitch.innerText = currentLang === 'fr' ? 'EN' : 'FR';
    updateContent(currentLang);
  });
}
