// Charger le menu et le footer
document.addEventListener("DOMContentLoaded", function() {
  // Charger le menu
  fetch('components/menu.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('menu-container').innerHTML = data;

      // Ajouter la logique active link
      const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
      document.querySelectorAll('.menu-link').forEach(link => {
        if (link.dataset.page === currentPage || (currentPage === '' && link.dataset.page === 'index')) {
          link.classList.add('active');
        }
      });
    });

  // Charger le footer
  fetch('components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    });
});

