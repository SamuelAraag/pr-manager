// script.js
import * as LocalStorage from './localStorageService.js';
import * as API from './apiService.js';
import * as DOM from './domService.js';
import { GitLabService } from './gitlabService.js';

let currentData = { prs: [] };
let currentSha = null;
const validDevs = ['Rodrigo Barbosa', 'Itallo Cerqueira', 'Marcos Paulo', 'Samuel Santos'];

// DOM Elements
const prModal = document.getElementById('prModal');
const setupModal = document.getElementById('setupModal');
const shortcutsModal = document.getElementById('shortcutsModal');
const prForm = document.getElementById('prForm');
const ghTokenInput = document.getElementById('ghTokenInput');
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
        openSetupModal();
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
            openSetupModal();
        } else {
            await loadData();
        }
    }
}

function showProfileSelection() {
    profileScreen.style.display = 'flex';
}

function openSetupModal() {
    ghTokenInput.value = LocalStorage.getItem('githubToken') || '';
    document.getElementById('glTokenInput').value = LocalStorage.getItem('gitlabToken') || '';
    setupModal.style.display = 'flex';
}

function updateUserDisplay(userName) {
    // Defines profile images
    const profileImages = {
        'Itallo Cerqueira': 'src/assets/profiles/itallo-cerqueira.jpeg',
        'Rodrigo Barbosa': 'src/assets/profiles/rodrigo-barbosa.jpeg'
    };

    const imageSrc = profileImages[userName] || 'src/assets/profiles/default-profile.png';

    currentUserDisplay.innerHTML = ''; // Clear text
    currentUserDisplay.style.background = 'transparent';
    currentUserDisplay.style.alignItems = 'normal';
    currentUserDisplay.style.justifyContent = 'normal';
    
    currentUserDisplay.appendChild(Object.assign(document.createElement('img'), {
        src: imageSrc,
        style: "width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;"
    }));

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

function updateReqVersionButton() {
    const btn = document.getElementById('reqVersionBtn');
    if (!btn) return;

    const hasPendingRequest = currentData.prs.some(p => p.approved && p.versionRequested);
    
    if (hasPendingRequest) {
        btn.textContent = 'Aguardando Versão...';
        btn.disabled = true;
        btn.classList.add('btn-outline'); // optional style change
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.innerHTML = '<i data-lucide="package-check"></i> Solicitar Versão';
        btn.disabled = false;
        btn.classList.remove('btn-outline');
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

async function loadData() {
    DOM.showLoading(true);
    const result = await API.fetchPRs();
    
    if (result.data) {
        currentData = result.data;
        currentSha = result.sha;
        DOM.renderTable(currentData.prs, openEditModal);
        updateReqVersionButton();
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

// Request Version Action
const reqVersionBtn = document.getElementById('reqVersionBtn');
if (reqVersionBtn) {
    reqVersionBtn.addEventListener('click', async () => {
        // Find approved PRs that don't have version and not yet requested
        const approvedPrs = currentData.prs.filter(p => p.approved);
        // We set versionRequested = true for all approved PRs (group based logic handled in render)
        // or just strict boolean flag on all.
        
        let changed = false;
        approvedPrs.forEach(pr => {
            if (!pr.version && !pr.versionRequested) {
                pr.versionRequested = true;
                changed = true;
            }
        });

        if (changed) {
            try {
                DOM.showLoading(true);
                const result = await API.savePRs(currentData, currentSha);
                currentData = result.newData;
                currentSha = result.newSha;
                DOM.showToast('Versão solicitada com sucesso!');
                DOM.renderTable(currentData.prs, openEditModal);
            } catch (error) {
                DOM.showToast('Erro ao solicitar versão: ' + error.message, 'error');
            } finally {
                DOM.showLoading(false);
            }
        } else {
            DOM.showToast('Nenhum PR aprovado pendente de solicitação.', 'info');
        }
    });
}

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
    const ghToken = ghTokenInput.value.trim();
    const glToken = document.getElementById('glTokenInput').value.trim();
    
    if (ghToken) {
        LocalStorage.setItem('githubToken', ghToken);
        if (glToken) LocalStorage.setItem('gitlabToken', glToken);
        
        setupModal.style.display = 'none';
        loadData();
    } else {
        alert('Por favor, insira um token válido do GitHub.');
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
        reqVersion: 'ok', // Deprecated or default
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

// Save Version for Group (Exposed to Window for inline onclick)
window.saveGroupVersion = async (projectName) => {
    const escapedName = projectName.replace(/\s/g, '');
    const version = document.getElementById(`v_ver_${escapedName}`).value;
    const pipeline = document.getElementById(`v_pipe_${escapedName}`).value;
    const rollback = document.getElementById(`v_roll_${escapedName}`).value;

    if (!version) {
        DOM.showToast('Por favor, informe a versão.', 'error');
        return;
    }

    if (confirm(`Aplicar versão ${version} para todos os PRs aprovados de "${projectName}"?`)) {
        let changed = false;
        
        currentData.prs.forEach(pr => {
            if (pr.project === projectName && pr.approved) {
                pr.version = version;
                pr.pipelineLink = pipeline;
                pr.rollback = rollback;
                pr.versionRequested = false; // Reset state
                pr.versionGroupStatus = 'done'; // Optional tracking
                changed = true;
            }
        });

        if (changed) {
            try {
                DOM.showLoading(true);
                const result = await API.savePRs(currentData, currentSha);
                currentData = result.newData;
                currentSha = result.newSha;
                DOM.showToast('Versão aplicada com sucesso!');
                DOM.renderTable(currentData.prs, openEditModal);
            } catch (error) {
                DOM.showToast('Erro ao salvar versão: ' + error.message, 'error');
            } finally {
                DOM.showLoading(false);
            }
        }
    }
};

// Create GitLab Issue
window.createGitLabIssue = async (projectName) => {
    const token = LocalStorage.getItem('gitlabToken');
    if (!token) {
        DOM.showToast('Configure o token do GitLab para continuar.', 'error');
        openSetupModal();
        document.getElementById('glTokenInput').focus();
        return;
    }

    const prs = currentData.prs.filter(p => p.project === projectName && p.approved);
    if (!prs.length) return;

    // Get version info from the first PR (they should be synced)
    const info = prs[0];
    
    if (!info.version) {
        DOM.showToast('Nenhuma versão definida para este grupo.', 'error');
        return;
    }

    const data = {
        modulo: projectName,
        versao: info.version,
        pipeline_url: info.pipelineLink || 'N/A',
        rollback: info.rollback
    };

    if (confirm(`Criar issue de deploy no GitLab para "${projectName} - ${info.version}"?`)) {
        try {
            DOM.showLoading(true);
            await GitLabService.createIssue(token, data);
            DOM.showToast('Chamado criado com sucesso no GitLab!');
        } catch (error) {
            DOM.showToast('Erro ao criar chamado: ' + error.message, 'error');
        } finally {
            DOM.showLoading(false);
        }
    }
};

// Start the app
init();
