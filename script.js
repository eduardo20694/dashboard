let sitesSection1 = [];
let sitesSection2 = [];
let robosSection2 = [];

const apiUrl = 'http://localhost:5000/validar-senha'; 

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

function openModal() {
  document.getElementById('addSiteModal').style.display = 'flex';
}

function openModalRobo() {
  document.getElementById('addRoboModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('addSiteModal').style.display = 'none';
}

function closeModalRobo() {
  document.getElementById('addRoboModal').style.display = 'none';
}

function openDeleteModal(index, section) {
  document.getElementById('deleteSiteModal').style.display = 'flex';
  window.siteToDelete = { index, section };
}

function openDeleteRoboModal(index) {
  document.getElementById('deleteRoboModal').style.display = 'flex';
  window.roboToDelete = { index };
}

function closeDeleteModal() {
  document.getElementById('deleteSiteModal').style.display = 'none';
  window.siteToDelete = null;
}

function closeDeleteRoboModal() {
  document.getElementById('deleteRoboModal').style.display = 'none';
  window.roboToDelete = null;
}

async function checkPassword(password) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senha: password }), // Ajuste aqui para enviar 'senha'
    });

    const data = await response.json();
    return data.autorizado === true; // Verifica se o campo 'autorizado' é true
  } catch (error) {
    alert('Erro ao verificar a senha!');
    return false;
  }
}

async function addSite() {
  const siteName = document.getElementById('siteName').value.trim();
  const siteLink = document.getElementById('siteLink').value.trim();
  const password = document.getElementById('password').value.trim();

  // Verifica a senha antes de adicionar o site
  const isPasswordValid = await checkPassword(password);
  if (!isPasswordValid) {
    alert('Senha incorreta!');
    return;
  }

  if (siteName && siteLink) {
    const newSite = { name: siteName, link: siteLink };
    if (document.getElementById('section1').classList.contains('active')) {
      sitesSection1.push(newSite);
      updateSiteCards(sitesSection1, 'siteCardsSection1');
    } else {
      sitesSection2.push(newSite);
      updateSiteCards(sitesSection2, 'siteCardsSection2');
    }
    updateSiteCount();

    document.getElementById('siteName').value = '';
    document.getElementById('siteLink').value = '';
    document.getElementById('password').value = '';

    closeModal();
  } else {
    alert('Preencha todos os campos.');
  }
}

async function addRobo() {
  const roboName = document.getElementById('roboName').value.trim();
  const password = document.getElementById('roboPassword').value.trim();

  // Verifica a senha antes de adicionar o robô
  const isPasswordValid = await checkPassword(password);
  if (!isPasswordValid) {
    alert('Senha incorreta!');
    return;
  }

  if (roboName) {
    const newRobo = { name: roboName };
    robosSection2.push(newRobo);
    updateRoboCards(robosSection2, 'roboCardsSection2');
    updateRoboCount();
    closeModalRobo();
  } else {
    alert('Preencha todos os campos.');
  }
}

async function deleteSite() {
  const password = document.getElementById('deleteAdminPassword').value.trim();

  // Verifica a senha antes de excluir o site
  const isPasswordValid = await checkPassword(password);
  if (!isPasswordValid) {
    alert('Senha incorreta!');
    return;
  }

  if (window.siteToDelete !== null) {
    const { index, section } = window.siteToDelete;
    if (section === 'siteCardsSection1') {
      sitesSection1.splice(index, 1);
      updateSiteCards(sitesSection1, 'siteCardsSection1');
    } else {
      sitesSection2.splice(index, 1);
      updateSiteCards(sitesSection2, 'siteCardsSection2');
    }
    updateSiteCount();
    closeDeleteModal();
  }
}

async function deleteRobo() {
  const password = document.getElementById('deleteRoboPassword').value.trim();

  // Verifica a senha antes de excluir o robô
  const isPasswordValid = await checkPassword(password);
  if (!isPasswordValid) {
    alert('Senha incorreta!');
    return;
  }

  if (window.roboToDelete !== null) {
    const { index } = window.roboToDelete;
    robosSection2.splice(index, 1);
    updateRoboCards(robosSection2, 'roboCardsSection2');
    updateRoboCount();
    closeDeleteRoboModal();
  }
}

function updateSiteCards(sitesArray, sectionId) {
  const siteCards = document.getElementById(sectionId);
  siteCards.innerHTML = '';

  sitesArray.forEach((site, index) => {
    const card = document.createElement('div');
    card.classList.add('site-card');
    
    const link = document.createElement('a');
    link.href = site.link;
    link.target = "_blank";
    link.textContent = site.name;
    
    const button = document.createElement('button');
    button.textContent = 'Excluir';
    button.onclick = () => openDeleteModal(index, sectionId);

    card.appendChild(link);
    card.appendChild(button);
    siteCards.appendChild(card);
  });
}

function updateRoboCards(robosArray, sectionId) {
  const roboCards = document.getElementById(sectionId);
  roboCards.innerHTML = '';

  robosArray.forEach((robo, index) => {
    const card = document.createElement('div');
    card.classList.add('site-card');

    const name = document.createElement('h3');
    name.textContent = robo.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => openDeleteRoboModal(index);

    card.appendChild(name);
    card.appendChild(deleteBtn);
    roboCards.appendChild(card);
  });
}

function updateSiteCount() {
  const totalSites = sitesSection1.length + sitesSection2.length;
  document.getElementById('siteCount').textContent = totalSites;
}

function updateRoboCount() {
  const totalRobos = robosSection2.length;
  document.getElementById('roboCount').textContent = totalRobos;
}

window.onload = function() {
    showSection('section5');  
};
