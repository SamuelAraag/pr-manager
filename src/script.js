// script.js
import * as LocalStorage from './localStorageService.js';
import * as API from './apiService.js';
import * as DOM from './domService.js';

let currentData = { prs: [] };
let currentSha = null;
const validDevs = ['Rodrigo Barbosa', 'Itallo Cerqueira', 'Marcos Paulo', 'Samuel Santos'];

// DOM Elements
const prModal = document.getElementById('prModal');
const setupModal = document.getElementById('setupModal');
const shortcutsModal = document.getElementById('shortcutsModal');
const prForm = document.getElementById('prForm');
const ghTokenInput = document.getElementById('ghTokenInput');
const generateVersionCheckbox = document.getElementById('generateVersion');
const versionSection = document.getElementById('versionSection');
const profileScreen = document.getElementById('profileScreen');
const currentUserDisplay = document.getElementById('currentUserDisplay');

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
    // If typing in an input or select, only Cmd+Enter is a shortcut
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            prForm.requestSubmit();
        }
        return;
    }

    const key = e.key.toLowerCase();

    // Global Shortcuts
    if (key === 'n') {
        e.preventDefault();
        openAddModal();
    } else if (key === 's') {
        e.preventDefault();
        setupModal.style.display = 'flex';
    } else if (key === 'r') {
        e.preventDefault();
        loadData();
    } else if (key === 'u') {
        e.preventDefault();
        showProfileSelection();
    } else if (key === '?' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        shortcutsModal.style.display = 'flex';
    } else if (e.key === 'Escape') {
        closeAllModals();
    }
});

function closeAllModals() {
    prModal.style.display = 'none';
    setupModal.style.display = 'none';
    shortcutsModal.style.display = 'none';
}

// Init
async function init() {
    LocalStorage.init();
    
    // Check for user
    const appUser = LocalStorage.getItem('appUser');
    if (!appUser) {
        showProfileSelection();
    } else {
        updateUserDisplay(appUser);
        
        // Check if token exists
        const token = LocalStorage.getItem('githubToken');
        if (!token) {
            setupModal.style.display = 'flex';
        } else {
            await loadData();
        }
    }
}

function showProfileSelection() {
    profileScreen.style.display = 'flex';
}

function updateUserDisplay(userName) {
    const initials = userName.split(' ').map(n => n[0]).join('');
    currentUserDisplay.textContent = initials;
}

// Profile Selection Event
document.querySelectorAll('.profile-item').forEach(item => {
    item.addEventListener('click', () => {
        const userName = item.getAttribute('data-user');
        LocalStorage.setItem('appUser', userName);
        updateUserDisplay(userName);
        profileScreen.style.display = 'none';
        
        // Re-run init logic now that user is set
        const token = LocalStorage.getItem('githubToken');
        if (!token) {
            setupModal.style.display = 'flex';
        } else {
            loadData();
        }
    });
});

// Click on avatar to change user
currentUserDisplay.addEventListener('click', () => {
    profileScreen.style.display = 'flex';
});

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
    document.getElementById('reqVersion').value = pr.reqVersion || '';
    
    // Toggle version section visibility
    const hasVersion = !!(pr.version || pr.pipelineLink || pr.rollback || pr.reqVersion);
    generateVersionCheckbox.checked = hasVersion;
    versionSection.style.display = hasVersion ? 'grid' : 'none';
    
    prModal.style.display = 'flex';
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Novo Pull Request';
    prForm.reset();
    document.getElementById('prId').value = '';
    
    // Auto-fill developer with current app user
    const appUser = LocalStorage.getItem('appUser');
    if (appUser) {
        document.getElementById('dev').value = appUser;
    }

    // Reset version section
    generateVersionCheckbox.checked = false;
    versionSection.style.display = 'none';
    
    prModal.style.display = 'flex';
}

// Event Listeners
document.getElementById('addPrBtn').addEventListener('click', openAddModal);
document.getElementById('setupBtn').addEventListener('click', () => setupModal.style.display = 'flex');
document.getElementById('shortcutsBtn').addEventListener('click', () => shortcutsModal.style.display = 'flex');
document.getElementById('changeUserBtn').addEventListener('click', showProfileSelection);

// Toggle version section
generateVersionCheckbox.addEventListener('change', (e) => {
    versionSection.style.display = e.target.checked ? 'grid' : 'none';
});

// Validation and Auto-fill for Dev Input
const devInput = document.getElementById('dev');

devInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const typedValue = e.target.value.trim().toLowerCase();
        
        // If empty or already a perfect match, let it be
        if (!typedValue || validDevs.some(d => d.toLowerCase() === typedValue)) {
            return;
        }

        // Find the first dev that starts with what was typed
        const match = validDevs.find(d => d.toLowerCase().startsWith(typedValue));
        
        if (match) {
            e.preventDefault(); // Prevent form submission
            e.target.value = match; // Auto-fill with the match
            DOM.showToast(`Auto-preenchido: ${match}`);
        }
    }
});

devInput.addEventListener('change', (e) => {
    if (e.target.value && !validDevs.includes(e.target.value)) {
        DOM.showToast('Desenvolvedor inválido. Escolha um da lista.', 'error');
        e.target.value = '';
    }
});

// Close modals
document.querySelectorAll('.close-btn, .close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
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
    
    const devInputForForm = document.getElementById('dev');

    if (!validDevs.includes(devInputForForm.value)) {
        DOM.showToast('Por favor, selecione um desenvolvedor válido da lista.', 'error');
        devInputForForm.focus();
        return;
    }

    const pr = {
        id: prId || Date.now().toString(),
        project: document.getElementById('project').value,
        dev: devInputForForm.value,
        summary: document.getElementById('summary').value,
        prLink: document.getElementById('prLink').value,
        taskLink: document.getElementById('taskLink').value,
        teamsLink: document.getElementById('teamsLink').value,
        pipelineLink: document.getElementById('pipelineLink').value,
        version: document.getElementById('version').value,
        rollback: document.getElementById('rollback').value,
        rev: prId ? (currentData.prs.find(p => p.id === prId)?.rev || false) : false,
        reqVersion: document.getElementById('reqVersion').value,
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
