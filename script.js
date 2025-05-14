function showSection(sectionId) {
  // Remove a classe 'active' de todas as seções
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  // Adiciona a classe 'active' à seção clicada
  document.getElementById(sectionId).classList.add('active');
}

function markSelected(element) {
  // Remove a classe 'selected' de todos os itens
  document.querySelectorAll('.sidebar ul li').forEach(item => {
    item.classList.remove('selected');
  });
  // Adiciona a classe 'selected' ao item clicado
  element.classList.add('selected');
}

// Mostra a seção HOME ao carregar a página e marca o item correspondente
window.onload = function() {
  showSection('section5');
  // Marca o item HOME na sidebar
  const homeLi = document.querySelector('.sidebar ul li:nth-child(3)');
  if (homeLi) {
    markSelected(homeLi);
  }
};

function atualizarResumo() {
  // Conta quantos cards tem na seção sites (section1)
  const sitesCount = document.querySelectorAll('#siteCardsSection1 .site-card').length;

  // Conta quantos cards tem na seção robôs (section2)
  const robosCount = document.querySelectorAll('#roboCardsSection2 .site-card').length;

  // Atualiza o texto das contagens na section5
  const sitesResumo = document.querySelector('#section5 .summary-card:nth-child(1) p');
  const robosResumo = document.querySelector('#section5 .summary-card:nth-child(2) p');

  if (sitesResumo) sitesResumo.textContent = sitesCount;
  if (robosResumo) robosResumo.textContent = robosCount;
}

// Chama a função ao carregar a página
window.addEventListener('DOMContentLoaded', atualizarResumo);
