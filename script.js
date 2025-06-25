function showSection(sectionId) {
 
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(sectionId).classList.add('active');
}

function markSelected(element) {
 
  document.querySelectorAll('.sidebar ul li').forEach(item => {
    item.classList.remove('selected');
  });

  element.classList.add('selected');
}

window.onload = function() {
  showSection('section5');
  
  const homeLi = document.querySelector('.sidebar ul li:nth-child(3)');
  if (homeLi) {
    markSelected(homeLi);
  }
};

function atualizarResumo() {

  const sitesCount = document.querySelectorAll('#siteCardsSection1 .site-card').length;

  const robosCount = document.querySelectorAll('#roboCardsSection2 .site-card').length;

  const sitesResumo = document.querySelector('#section5 .summary-card:nth-child(1) p');
  const robosResumo = document.querySelector('#section5 .summary-card:nth-child(2) p');

  if (sitesResumo) sitesResumo.textContent = sitesCount;
  if (robosResumo) robosResumo.textContent = robosCount;
}

window.addEventListener('DOMContentLoaded', atualizarResumo);

function abrirPopupSobreMim() {
  document.getElementById("popupSobreMim").style.display = "flex";
}

function fecharPopupSobreMim() {
  document.getElementById("popupSobreMim").style.display = "none";
}

window.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("musicaIntro");

  function tocarMusicaUmaVez() {
    audio.play().catch((e) => {
      console.log("Autoplay bloqueado, aguardando interação.");
    });
    window.removeEventListener("click", tocarMusicaUmaVez);
    window.removeEventListener("touchstart", tocarMusicaUmaVez);
  }

  window.addEventListener("click", tocarMusicaUmaVez);
  window.addEventListener("touchstart", tocarMusicaUmaVez);
});