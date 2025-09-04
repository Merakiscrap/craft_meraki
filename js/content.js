let langue = 'fr';

function loadContent(lang){
  fetch(`assets/translations/content-${lang}.json`)
    .then(resp => resp.json())
    .then(data => {
      document.getElementById('heroTitle').innerText = data.heroTitle;
      document.getElementById('merakiStory').innerHTML = data.merakiStory.replace(/\n/g, '<br>');
      const portfolioBtn = document.getElementById('portfolioButton');
      portfolioBtn.innerText = data.portfolioButton;
      portfolioBtn.href = "galerie.html";

      const previewOffers = document.getElementById('previewOffers');
      previewOffers.innerHTML = '';
      data.previewOffers.forEach(offer => {
        const circle = document.createElement('a');
        circle.href = offer.link;
        circle.className = 'circle';
        circle.innerHTML = `<span class="title">${offer.title}</span><span class="subtitle">${offer.text}</span>`;
        previewOffers.appendChild(circle);
      });
    })
    .catch(err => console.error("Erreur JSON:", err));
}

// Initial load
loadContent(langue);

// Changement langue (FR/EN)
document.addEventListener('DOMContentLoaded', () => {
  const langSwitch = document.getElementById('langSwitch');
  langSwitch.addEventListener('click', e => {
    e.preventDefault();
    langue = (langue === 'fr') ? 'en' : 'fr';
    langSwitch.innerText = (langue === 'fr') ? 'EN' : 'FR';
    loadContent(langue);
  });
});

