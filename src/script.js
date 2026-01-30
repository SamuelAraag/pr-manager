// script.js
import * as LocalStorage from './localStorageService.js';
import * as API from './apiService.js';
import * as DOM from './domService.js';

let currentData = { prs: [] };
let currentSha = null;

// DOM Elements
const prModal = document.getElementById('prModal');
const setupModal = document.getElementById('setupModal');
const prForm = document.getElementById('prForm');
const ghTokenInput = document.getElementById('ghTokenInput');

// Init
async function init() {
    LocalStorage.init();
    
    // Check if token exists
    const token = LocalStorage.getItem('githubToken');
    if (!token) {
        setupModal.style.display = 'flex';
    } else {
        await loadData();
    }
}

async function loadData() {
    DOM.showLoading(true);
    const result = await API.fetchPRs();
    
    if (result.data) {
        currentData = result.data;
        currentSha = result.sha;
        DOM.renderTable(currentData.prs, openEditModal);
    } else {
        DOM.showToast('Erro ao carregar dados do GitHub', 'error');
    }
    DOM.showLoading(false);
}

function openEditModal(pr) {
    document.getElementById('modalTitle').textContent = 'Editar Pull Request';
    document.getElementById('prId').value = pr.id;
    document.getElementById('project').value = pr.project || 'DF-e';
    document.getElementById('dev').value = pr.dev || '';
    document.getElementById('summary').value = pr.summary || '';
    document.getElementById('prLink').value = pr.prLink || '';
    document.getElementById('taskLink').value = pr.taskLink || '';
    document.getElementById('teamsLink').value = pr.teamsLink || '';
    document.getElementById('pipelineLink').value = pr.pipelineLink || '';
    document.getElementById('version').value = pr.version || '';
    document.getElementById('rollback').value = pr.rollback || '';
    document.getElementById('rev').value = pr.rev || '';
    document.getElementById('reqVersion').value = pr.reqVersion || '';
    document.getElementById('docLink').value = pr.docLink || '';
    
    prModal.style.display = 'flex';
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Novo Pull Request';
    prForm.reset();
    document.getElementById('prId').value = '';
    prModal.style.display = 'flex';
}

// Event Listeners
document.getElementById('addPrBtn').addEventListener('click', openAddModal);
document.getElementById('setupBtn').addEventListener('click', () => setupModal.style.display = 'flex');

// Close modals
document.querySelectorAll('.close-btn, .close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        prModal.style.display = 'none';
        setupModal.style.display = 'none';
    });
});

// Save Config (Token)
document.getElementById('saveConfigBtn').addEventListener('click', () => {
    const token = ghTokenInput.value.trim();
    if (token) {
        LocalStorage.setItem('githubToken', token);
        setupModal.style.display = 'none';
        loadData();
    } else {
        alert('Por favor, insira um token válido.');
    }
});

// Form Submit
prForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const prId = document.getElementById('prId').value;
    const pr = {
        id: prId || Date.now().toString(),
        project: document.getElementById('project').value,
        dev: document.getElementById('dev').value,
        summary: document.getElementById('summary').value,
        prLink: document.getElementById('prLink').value,
        taskLink: document.getElementById('taskLink').value,
        teamsLink: document.getElementById('teamsLink').value,
        pipelineLink: document.getElementById('pipelineLink').value,
        version: document.getElementById('version').value,
        rollback: document.getElementById('rollback').value,
        rev: document.getElementById('rev').value,
        reqVersion: document.getElementById('reqVersion').value,
        docLink: document.getElementById('docLink').value,
        updatedAt: new Date().toISOString()
    };

    const newData = { ...currentData };
    if (prId) {
        const index = newData.prs.findIndex(p => p.id === prId);
        if (index !== -1) newData.prs[index] = pr;
    } else {
        newData.prs.push(pr);
    }

    try {
        DOM.showLoading(true);
        const result = await API.savePRs(newData, currentSha);
        currentData = result.newData;
        currentSha = result.newSha;
        
        DOM.renderTable(currentData.prs, openEditModal);
        DOM.showToast('Sucesso! Dados sincronizados no GitHub.');
        prModal.style.display = 'none';
    } catch (error) {
        DOM.showToast('Erro ao salvar: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
});

// Start the app
init();
