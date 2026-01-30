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
const approveBtn = document.getElementById('approveBtn');

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

    // Show/Hide Verify Button based on user
    if (userName === 'Samuel Santos') {
        document.documentElement.style.setProperty('--admin-display', 'flex');
    } else {
        document.documentElement.style.setProperty('--admin-display', 'none');
    }
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
    
    // Handle Approval State
    const appUser = LocalStorage.getItem('appUser');
    const isSamuel = appUser === 'Samuel Santos';
    const isApproved = !!pr.approved;

    // Show Approve Button ONLY if: It's Samuel AND Not Approved yet
    approveBtn.style.display = (isSamuel && !isApproved) ? 'block' : 'none';

    // Lock fields if approved
    const fieldsToLock = ['project', 'dev', 'summary', 'prLink', 'taskLink', 'teamsLink'];
    fieldsToLock.forEach(id => {
        document.getElementById(id).disabled = isApproved;
    });

    if (isApproved) {
        document.getElementById('modalTitle').innerHTML = 'Editar Pull Request <span class="tag" style="background:#238636; color:white; margin-left:10px;">Aprovado</span>';
    } else {
        document.getElementById('modalTitle').textContent = 'Editar Pull Request';
    }

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

    // Reset Lock
    approveBtn.style.display = 'none';
    const fieldsToLock = ['project', 'dev', 'summary', 'prLink', 'taskLink', 'teamsLink'];
    fieldsToLock.forEach(id => {
        document.getElementById(id).disabled = false;
    });
    
    prModal.style.display = 'flex';
}

// Event Listeners
document.getElementById('addPrBtn').addEventListener('click', openAddModal);
document.getElementById('setupBtn').addEventListener('click', () => setupModal.style.display = 'flex');
document.getElementById('shortcutsBtn').addEventListener('click', () => shortcutsModal.style.display = 'flex');
document.getElementById('changeUserBtn').addEventListener('click', showProfileSelection);

// Approve PR Action
approveBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const prId = document.getElementById('prId').value;
    if (!prId) return;

    if (confirm('Aprovar este PR? Os campos principais serão bloqueados.')) {
        const index = currentData.prs.findIndex(p => p.id === prId);
        if (index !== -1) {
            currentData.prs[index].approved = true;
            currentData.prs[index].approvedBy = 'Samuel Santos';
            currentData.prs[index].approvedAt = new Date().toISOString();
            
            // Re-open/Refresh modal logic to apply lock visual immediately before saving?
            // Or just save. Let's save.
            
            // We need to trigger a save. We can re-use the form submit logic or call API directly.
            // Calling API directly is safer/cleaner here.
            
            try {
                DOM.showLoading(true);
                const result = await API.savePRs(currentData, currentSha);
                currentData = result.newData;
                currentSha = result.newSha;
                
                DOM.showToast('PR Aprovado com sucesso!');
                prModal.style.display = 'none';
                DOM.renderTable(currentData.prs, openEditModal);
            } catch (error) {
                DOM.showToast('Erro ao aprovar: ' + error.message, 'error');
            } finally {
                DOM.showLoading(false);
            }
        }
    }
});

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
    const prId = document.getElementById('prId').value;

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
        approved: prId ? (currentData.prs.find(p => p.id === prId)?.approved || false) : false,
        updatedAt: new Date().toISOString()
    };

    const newData = { 
        ...currentData,
        prs: [...currentData.prs]
    };

    if (prId) {
        const index = newData.prs.findIndex(p => p.id === prId);
        if (index !== -1) {
            newData.prs[index] = pr;
        }
    } else {
        newData.prs.push(pr);
    }

    try {
        DOM.showLoading(true);
        console.log('Tentando salvar PR:', pr);
        console.log('SHA atual:', currentSha);
        
        const result = await API.savePRs(newData, currentSha);
        
        currentData = result.newData;
        currentSha = result.newSha;
        
        DOM.renderTable(currentData.prs, openEditModal);
        DOM.showToast('Sucesso! Dados sincronizados no GitHub.');
        prModal.style.display = 'none';
        prForm.reset();
    } catch (error) {
        console.error('Erro detalhado ao salvar:', error);
        DOM.showToast('Erro ao salvar: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
});

// Start the app
init();
