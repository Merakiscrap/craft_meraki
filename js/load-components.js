// Injection menu et footer
fetch('components/menu.html')
  .then(resp => resp.text())
  .then(data => { document.getElementById('menu-container').innerHTML = data; })
  .then(()=>{ initMenu(); });

fetch('components/footer.html')
  .then(resp => resp.text())
  .then(data => { document.getElementById('footer-container').innerHTML = data; });

// Init menu hover/clic
function initMenu(){
  const logo = document.querySelector('.logo img');
  const nav = document.querySelector('nav');
  const menuLinks = document.querySelectorAll('.menu a');

  // Desktop hover
  if(window.innerWidth >= 769){
    logo.addEventListener('mouseenter',()=>nav.classList.add('open'));
    nav.addEventListener('mouseleave',()=>nav.classList.remove('open'));
  }

  // Mobile click
  logo.addEventListener('click', e=>{
    if(window.innerWidth < 769){ e.preventDefault(); nav.classList.toggle('open'); }
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if(window.innerWidth < 769) nav.classList.remove('open');
    });
  });
}
