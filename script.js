let sitesSection1 = [];
let sitesSection2 = [];
let robosSection2 = [];

// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyAI-P662br4j_jw39bCQOcAE_DlIHz9tYk",
  authDomain: "bancodedados-f8c80.firebaseapp.com",
  projectId: "bancodedados-f8c80",
  storageBucket: "bancodedados-f8c80.firebasestorage.app",
  messagingSenderId: "53114778309",
  appId: "1:53114778309:web:14714009d7a9f0c90436ac"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function showSection(sectionId) {
  // Remove a classe 'active' de todas as seções
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  // Adiciona a classe 'active' à seção clicada
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
    const response = await fetch('https://apidash-csqx.onrender.com/validar-senha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senha: password }),
    });

    const data = await response.json();
    return data.autorizado === true;
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
    let sectionId = 'siteCardsSection1';
    if (document.getElementById('section2').classList.contains('active')) {
      sitesSection2.push(newSite);
      sectionId = 'siteCardsSection2';
    } else {
      sitesSection1.push(newSite);
    }
    updateSiteCards(sitesSection1.concat(sitesSection2), sectionId);
    // Salva o site no Firebase
    db.collection("sites").add(newSite);
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
    // Salva o robô no Firebase
    db.collection("robos").add(newRobo);
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
    let siteId;
    if (section === 'siteCardsSection1') {
      siteId = sitesSection1[index].id;
      sitesSection1.splice(index, 1);
      updateSiteCards(sitesSection1.concat(sitesSection2), 'siteCardsSection1');
    } else {
      siteId = sitesSection2[index].id;
      sitesSection2.splice(index, 1);
      updateSiteCards(sitesSection1.concat(sitesSection2), 'siteCardsSection2');
    }
    updateSiteCount();
    closeDeleteModal();
    // Exclui o site do Firebase
    db.collection("sites").doc(siteId).delete();
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
    const roboId = robosSection2[index].id;
    robosSection2.splice(index, 1);
    updateRoboCards(robosSection2, 'roboCardsSection2');
    updateRoboCount();
    closeDeleteRoboModal();
    // Exclui o robô do Firebase
    db.collection("robos").doc(roboId).delete();
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

// Função para exibir a seção ao carregar a página
window.onload = function() {
  showSection('section5');  
};

function markSelected(element) {
  // Remove a classe 'selected' de todos os itens
  document.querySelectorAll('ul li').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Marca o item como selecionado
  element.classList.add('selected');
}

