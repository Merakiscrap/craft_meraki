// ==========================
// Universal Load Menu & Footer + Menu & Language Init
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  // --- Ensure containers exist ---
  if (!document.getElementById('menu-container')) {
    const menuDiv = document.createElement('div');
    menuDiv.id = 'menu-container';
    document.body.prepend(menuDiv); // insert at top
  }
  if (!document.getElementById('footer-container')) {
    const footerDiv = document.createElement('div');
    footerDiv.id = 'footer-container';
    document.body.appendChild(footerDiv); // insert at bottom
  }

  const menuContainer = document.getElementById('menu-container');
  const footerContainer = document.getElementById('footer-container');

  // --- Compute base path for components (auto-adjust for subfolders) ---
  const pathParts = window.location.pathname.split('/');
  let basePath = '/';
  if (pathParts.length > 2) {
    basePath = '../'.repeat(pathParts.length - 2);
  }

  // --- Load menu and footer ---
  Promise.all([
    fetch('components/menu.html').then(r => r.text()),
    fetch('components/footer.html').then(r => r.text())
  ])
  .then(([menuHTML, footerHTML]) => {
    menuContainer.innerHTML = menuHTML;
    footerContainer.innerHTML = footerHTML;

    // --- Highlight active page ---
  $("#menu").load("menu.html", function(){
    const pageId = document.body.dataset.page;
    if (pageId) {
      document.querySelectorAll('nav ul li a').forEach(link => {
        const hrefPage = link.getAttribute('href').split('.')[0];
        if (hrefPage === pageId) link.classList.add('active');
        else link.classList.remove('active');
      });
    }
    });

    // --- Initialize menu and language switch ---
    if (typeof initMenuAndLang === 'function') {
      initMenuAndLang();
    } else {
      initMenuAndLang();
    }
  })
  .catch(err => console.error('Error loading menu/footer:', err));

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

    // --- Mobile scroll hide ---
    window.addEventListener('scroll', () => {
      if (header && window.innerWidth <= mobileBreakpoint) {
        const currentScroll = window.pageYOffset;
        header.style.top = currentScroll > lastScroll ? `-${header.offsetHeight}px` : '0';
        lastScroll = currentScroll;
      }
    });

    // --- Desktop hover menu ---
    if (logo && nav && window.innerWidth > mobileBreakpoint) {
      logo.addEventListener('mouseenter', () => nav.classList.add('open'));
      nav.addEventListener('mouseleave', () => nav.classList.remove('open'));
    }

    // --- Mobile click toggle ---
    if (logo && nav) {
      logo.addEventListener('click', e => {
        if (window.innerWidth <= mobileBreakpoint) {
          e.preventDefault();
          nav.classList.toggle('open');
        }
      });
    }

    // --- Close menu on mobile link click ---
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= mobileBreakpoint && nav) nav.classList.remove('open');
      });
    });

    // --- Language switch ---
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
              // For index page circles
          if (key === 'previewOffers') {
  el.innerHTML = '';
  pageContent.previewOffers.forEach(offer => {
    const circle = document.createElement('a');
    circle.href = offer.link;
    circle.className = 'circle';
    circle.innerHTML = `<span class="title">${offer.title}</span><span class="subtitle">${offer.text}</span>`;
    el.appendChild(circle);
  });
} else if (key === 'offers') {
  // For offres page sections
  el.innerHTML = '';
  pageContent.offers.forEach(offer => {
    const section = document.createElement('section');
    section.className = 'offer-section';
    section.innerHTML = `
      <h2>${offer.title}</h2>
      <p>${offer.description}</p>
      <ul>${offer.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <p><strong>${offer.price}</strong></p>
    `;
    el.appendChild(section);
  });
} else {
  el.innerHTML = pageContent[key];
}

          }
        })
        .catch(err => console.error(`Error loading translation content for ${lang}:`, err));
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
});

