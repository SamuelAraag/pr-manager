import * as LocalStorage from './localStorageService.js';
import * as API from './apiService.js';
import * as DOM from './domService.js';
import { GitLabService } from './automationService.js';
import { EffectService } from './effectService.js';

let currentData = { prs: [] };
let availableUsers = [];
const validDevs = ['Rodrigo Barbosa', 'Itallo Cerqueira', 'Marcos Paulo', 'Samuel Santos', 'Kemilly Alvez'];

// Load users from API
async function loadUsers() {
    try {
        const users = await API.fetchUsers();
        if (users && users.length > 0) {
            availableUsers = users;
            console.log('Usuários carregados:', availableUsers);
            return true;
        } else {
            console.warn('Nenhum usuário encontrado na API, usando lista padrão');
            return false;
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return false;
    }
}

// Render profile selection dynamically
function renderProfileSelection() {
    const profilesGrid = document.querySelector('.profiles-grid');
    if (!profilesGrid) return;
    
    profilesGrid.innerHTML = '';
    
    const usersToShow = (availableUsers.length > 0 ? availableUsers : 
        validDevs.map((name, index) => ({ id: index + 1, name, profileImage: null })))
        .filter(user => user.name !== 'Samuel Santos');
    
    usersToShow.forEach(user => {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';
        profileItem.setAttribute('data-user', user.name);
        profileItem.setAttribute('data-user-id', user.id);
        
        const defaultImages = {
            'Itallo Cerqueira': 'src/assets/profiles/itallo-cerqueira.jpeg',
            'Rodrigo Barbosa': 'src/assets/profiles/rodrigo-barbosa.jpeg',
            'Kemilly Alvez': 'src/assets/profiles/kemilly-alvez.jpeg',
            'Samuel Santos': 'src/assets/profiles/samuel-santos-profile.png'
        };
        
        const imageSrc = user.profileImage || defaultImages[user.name] || 'src/assets/profiles/default-profile.png';
        
        profileItem.innerHTML = `
            <img class="avatar" src="${imageSrc}">
            <span>${user.name}</span>
        `;
        
        profilesGrid.appendChild(profileItem);
    });
    
    // Re-attach event listeners
    attachProfileListeners();
}

// Populate developer datalist
function populateDevList() {
    const devList = document.getElementById('devList');
    if (!devList) return;
    
    devList.innerHTML = '';
    
    const usersToShow = availableUsers.length > 0 ? availableUsers : 
        validDevs.map((name, index) => ({ id: index + 1, name }));
    
    usersToShow.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        devList.appendChild(option);
    });
}

// Get user ID by name
function getUserIdByName(userName) {
    if (availableUsers.length > 0) {
        const user = availableUsers.find(u => u.name === userName);
        return user ? user.id : null;
    }
    // Fallback to hardcoded mapping
    const devMap = {
        'Rodrigo Barbosa': 1,
        'Itallo Cerqueira': 2,
        'Marcos Paulo': 3,
        'Samuel Santos': 4,
        'Kemilly Alvez': 5
    };
    return devMap[userName] || null;
}

const prModal = document.getElementById('prModal');
const setupModal = document.getElementById('setupModal');
const shortcutsModal = document.getElementById('shortcutsModal');
const prForm = document.getElementById('prForm');
const ghTokenInput = document.getElementById('ghTokenInput');
const profileScreen = document.getElementById('profileScreen');

window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            prForm.requestSubmit();
        }
        return;
    }

    const key = e.key.toLowerCase();

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
    } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'k') {
        e.preventDefault();
        const currentUser = LocalStorage.getItem('appUser');
        const adminUser = 'Samuel Santos';

        if (currentUser === adminUser) {
            const previousUser = LocalStorage.getItem('previousUser');
            if (previousUser && previousUser !== adminUser) {
                LocalStorage.setItem('appUser', previousUser);
                updateUserDisplay(previousUser);
                loadData();
            } else {
                DOM.showToast('Nenhum usuário anterior encontrado.', 'error');
            }
        } else {
            LocalStorage.setItem('previousUser', currentUser);
            EffectService.triggerGodMode();
            profileScreen.style.display = 'none';
            
            LocalStorage.setItem('appUser', adminUser);
            updateUserDisplay(adminUser);
            loadData(true);
        }
    }
});

function closeAllModals() {
    prModal.style.display = 'none';
    setupModal.style.display = 'none';
    shortcutsModal.style.display = 'none';
}

async function init() {
    LocalStorage.init();
    
    // Load users from API first
    await loadUsers();
    renderProfileSelection();
    populateDevList();
    
    const appUser = LocalStorage.getItem('appUser');
    if (!appUser) {
        showProfileSelection();
    } else {
        updateUserDisplay(appUser);
        
        const token = LocalStorage.getItem('githubToken');
        if (!token) {
            openSetupModal();
        } else {
            await loadData();
        }
    }
}

function attachProfileListeners() {
    document.querySelectorAll('.profile-item').forEach(item => {
        item.addEventListener('click', () => {
            const userName = item.getAttribute('data-user');
            const userId = item.getAttribute('data-user-id');
            
            if (userName === 'Samuel Santos') {
                EffectService.triggerGodMode();
            }

            LocalStorage.setItem('appUser', userName);
            LocalStorage.setItem('appUserId', userId);
            updateUserDisplay(userName);
            profileScreen.style.display = 'none';
            
            const token = LocalStorage.getItem('githubToken');
            if (!token) {
                setupModal.style.display = 'flex';
            } else {
                loadData(true);
            }
        });
    });
}

function showProfileSelection() {
    profileScreen.style.display = 'flex';
}

// openSetupModal is defined below near the save button logic


function updateUserDisplay(userName) {
    const profileImages = {
        'Itallo Cerqueira': 'src/assets/profiles/itallo-cerqueira.jpeg',
        'Rodrigo Barbosa': 'src/assets/profiles/rodrigo-barbosa.jpeg',
        'Kemilly Alvez': 'src/assets/profiles/kemilly-alvez.jpeg',
        'Samuel Santos': 'src/assets/profiles/samuel-santos-profile.png'
    };

    const imageSrc = profileImages[userName] || 'src/assets/profiles/default-profile.png';

    currentUserDisplay.innerHTML = '';
    currentUserDisplay.style.background = 'transparent';
    currentUserDisplay.style.alignItems = 'normal';
    currentUserDisplay.style.justifyContent = 'normal';
    
    currentUserDisplay.appendChild(Object.assign(document.createElement('img'), {
        src: imageSrc,
        style: "width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;"
    }));

    if (userName === 'Samuel Santos') {
        document.documentElement.style.setProperty('--admin-display', 'flex');
    } else {
        document.documentElement.style.setProperty('--admin-display', 'none');
    }

    // Show/hide setup button - only admin can configure tokens
    const setupBtn = document.getElementById('setupBtn');
    if (setupBtn) {
        setupBtn.style.display = userName === 'Samuel Santos' ? 'inline-flex' : 'none';
    }
}

async function loadData(skipLoading = false) {
    const token = LocalStorage.getItem('githubToken');
    if (!token) {
        DOM.showToast('Token não configurado. Por favor, adicione o token do GitHub.', 'error');
        setupModal.style.display = 'flex';
        return;
    }

    if (!skipLoading) {
        DOM.showLoading(true);
    }
    
    try {
        const [prResult, batches] = await Promise.all([
            API.fetchPRs(),
            API.fetchBatches()
        ]);
        
        if (prResult && batches) {
            currentData.prs = prResult.prs;
            DOM.renderTable(prResult.prs, batches, openEditModal);
        } else {
            DOM.showToast('Erro ao carregar dados da API', 'error');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        DOM.showToast('Erro ao carregar dados da API', 'error');
    } finally {
        if (!skipLoading) {
            DOM.showLoading(false);
        }
    }
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

    const appUser = LocalStorage.getItem('appUser');
    const isSamuel = appUser === 'Samuel Santos';
    const isApproved = !!pr.approved;


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
    
    const appUser = LocalStorage.getItem('appUser');
    if (appUser) {
        document.getElementById('dev').value = appUser;
    }

    const fieldsToLock = ['project', 'dev', 'summary', 'prLink', 'taskLink', 'teamsLink'];
    fieldsToLock.forEach(id => {
        document.getElementById(id).disabled = false;
    });
    
    prModal.style.display = 'flex';
}

document.getElementById('addPrBtn').addEventListener('click', openAddModal);
document.getElementById('setupBtn').addEventListener('click', () => setupModal.style.display = 'flex');
document.getElementById('shortcutsBtn').addEventListener('click', () => shortcutsModal.style.display = 'flex');
document.getElementById('changeUserBtn').addEventListener('click', showProfileSelection);

// Shortcuts specific function
window.approvePr = async (prId) => {
    if (!prId) return;

    if (!confirm('Tem certeza que deseja aprovar este PR?')) {
        return;
    }
    
    // Check if user is logged in
    const appUserId = LocalStorage.getItem('appUserId');
    if (!appUserId) {
        DOM.showToast('Erro: Usuário não identificado. Selecione um perfil na tela inicial.', 'error');
        return;
    }

    try {
        DOM.showLoading(true);
        await API.approvePR(prId, parseInt(appUserId));
        
        DOM.showToast('PR Aprovado com sucesso!');
        await loadData(true);
        
        const prModal = document.getElementById('prModal');
        if (prModal && prModal.style.display === 'flex') {
            prModal.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao aprovar:', error);
        DOM.showToast('Erro ao aprovar: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
};

window.requestCorrection = async (prId) => {
    if (!prId) return;

    if (!confirm('Solicitar correção para este PR?')) {
        return;
    }

    try {
        DOM.showLoading(true);
        await API.requestCorrection(prId);
        
        DOM.showToast('Correção solicitada com sucesso!');
        await loadData(true);
    } catch (error) {
        console.error('Erro ao solicitar correção:', error);
        DOM.showToast('Erro ao solicitar correção: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
};

window.markPrFixed = async (prId) => {
    if (!prId) return;

    if (!confirm('Marcar este PR como corrigido e reenviar para revisão?')) {
        return;
    }

    try {
        DOM.showLoading(true);
        await API.markPrFixed(prId);
        
        DOM.showToast('PR marcado como corrigido!');
        await loadData(true);
    } catch (error) {
        console.error('Erro ao marcar corrigido:', error);
        DOM.showToast('Erro: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
};


const devInput = document.getElementById('dev');

devInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const typedValue = e.target.value.trim().toLowerCase();
        
        if (!typedValue || validDevs.some(d => d.toLowerCase() === typedValue)) {
            return;
        }

        const match = validDevs.find(d => d.toLowerCase().startsWith(typedValue));
        
        if (match) {
            e.preventDefault();
            e.target.value = match;
            DOM.showToast(`Auto-preenchido: ${match}`);
        }
    }
});

devInput.addEventListener('change', (e) => {
    const isValid = validDevs.includes(e.target.value) || 
                    availableUsers.find(u => u.name === e.target.value);
    
    if (e.target.value && !isValid) {
        DOM.showToast('Desenvolvedor inválido. Escolha um da lista.', 'error');
        e.target.value = '';
    }
});

document.querySelectorAll('.close-btn, .close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

function openSetupModal() {
    DOM.showLoading(true);
    API.getAutomationConfig().then(config => {
        if (config) {
            ghTokenInput.value = config.githubToken || '';
            document.getElementById('glTokenInput').value = config.gitlabToken || '';
        } else {
            ghTokenInput.value = LocalStorage.getItem('githubToken') || '';
            document.getElementById('glTokenInput').value = LocalStorage.getItem('gitlabToken') || '';
        }
    }).catch(err => {
        console.error('Erro ao buscar config:', err);
        ghTokenInput.value = LocalStorage.getItem('githubToken') || '';
        document.getElementById('glTokenInput').value = LocalStorage.getItem('gitlabToken') || '';
    }).finally(() => {
        DOM.showLoading(false);
        setupModal.style.display = 'flex';
    });
}

// ...

document.getElementById('saveConfigBtn').addEventListener('click', async () => {
    const ghToken = ghTokenInput.value.trim();
    const glToken = document.getElementById('glTokenInput').value.trim();
    
    if (!ghToken || !glToken) {
        alert('Por favor, insira um token válido do GitHub e GitLab.');
        return;
    }

    if (!confirm('Deseja realmente salvar essas configurações? Verifique se os tokens estão corretos.')) {
        return;
    }

    try {
        debugger;
        DOM.showLoading(true);
        await API.saveAutomationConfig({
            githubToken: ghToken,
            gitlabToken: glToken
        });

        LocalStorage.setItem('githubToken', ghToken);
        if (glToken) LocalStorage.setItem('gitlabToken', glToken);
        
        DOM.showToast('Configurações salvas com sucesso!');
        setupModal.style.display = 'none';
        loadData();
    } catch (error) {
        DOM.showToast('Erro ao salvar configurações: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
});

prForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const devInputForForm = document.getElementById('dev');
    const prIdInput = document.getElementById('prId').value;
    const devName = devInputForForm.value;

    if (!validDevs.includes(devName) && !availableUsers.find(u => u.name === devName)) {
        DOM.showToast('Por favor, selecione um desenvolvedor válido da lista.', 'error');
        devInputForForm.focus();
        return;
    }

    try {
        DOM.showLoading(true);
        
        const devId = getUserIdByName(devName);
        
        if (!devId) {
            DOM.showToast('Erro: Desenvolvedor não encontrado', 'error');
            return;
        }
        
        const prData = {
            project: document.getElementById('project').value,
            devId: devId,
            summary: document.getElementById('summary').value,
            prLink: document.getElementById('prLink').value || '',
            taskLink: document.getElementById('taskLink').value || '',
            teamsLink: document.getElementById('teamsLink').value || ''
        };

        let savedPR;
        
        if (prIdInput) {
            savedPR = await API.updatePR(prIdInput, prData);
            DOM.showToast('PR atualizado com sucesso!');
        } else {
            savedPR = await API.createPR(prData);
            DOM.showToast('PR criado com sucesso!');
        }
        
        await loadData(true);
        
        prModal.style.display = 'none';
        prForm.reset();
    } catch (error) {
        console.error('Erro detalhado ao salvar:', error);
        DOM.showToast('Erro ao salvar: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
});


window.saveGroupVersion = async (batchId) => {
    const elVersion = document.getElementById(`v_ver_${batchId}`);
    const elPipeline = document.getElementById(`v_pipe_${batchId}`);
    const elRollback = document.getElementById(`v_roll_${batchId}`);

    if (!elVersion || !elPipeline || !elRollback) {
        DOM.showToast('Erro interno: Campos de formulário não encontrados (ID mismatch).', 'error');
        return;
    }

    const version = elVersion.value.trim();
    const pipeline = elPipeline.value.trim();
    const rollback = elRollback.value.trim();

    [elVersion, elPipeline, elRollback].forEach(el => el.style.border = '1px solid #30363d');

    let hasError = false;

    if (!version) {
        elVersion.style.border = '1px solid #da3633';
        hasError = true;
    }
    if (!pipeline) {
        elPipeline.style.border = '1px solid #da3633';
        hasError = true;
    }
    if (!rollback) {
        elRollback.style.border = '1px solid #da3633';
        hasError = true;
    }

    if (hasError) {
        DOM.showToast('Preencha todos os campos obrigatórios.', 'error');
        return;
    }

    const versionRegex = /^\d+\.\d+\.\d+\.\d+$/;
    
    if (!versionRegex.test(version)) {
        elVersion.style.border = '1px solid #da3633';
        DOM.showToast('Versão inválida. Use 4 grupos numéricos (ex: 26.01.30.428)', 'error');
        return;
    }

    if (!versionRegex.test(rollback)) {
        elRollback.style.border = '1px solid #da3633';
        DOM.showToast('Rollback inválido. Use 4 grupos numéricos (ex: 26.01.30.428)', 'error');
        return;
    }

    if (confirm(`Aplicar versão ${version} para este lote?`)) {
        try {
            DOM.showLoading(true);
            
            const batchData = {
                batchId: batchId,
                version: version,
                pipelineLink: pipeline,
                rollback: rollback
            };

            await API.saveVersionBatch(batchData);
            
            DOM.showToast('Versão aplicada com sucesso!');
            await loadData(true);
        } catch (error) {
            DOM.showToast('Erro ao salvar versão: ' + error.message, 'error');
        } finally {
            DOM.showLoading(false);
        }
    }
};

window.requestVersionBatch = async (prIds, projectName) => {
    if (!projectName) projectName = 'este projeto';
    
    console.log('Solicitando versão para IDs:', prIds);

    if (confirm(`Solicitar versão para ${prIds.length} PRs aprovados de "${projectName}"?`)) {
        try {
            DOM.showLoading(true);
            
            await API.requestVersionBatch(prIds);
            
            DOM.showToast('Versão solicitada com sucesso!');
            await loadData(true);
        } catch (error) {
            console.error('Erro ao solicitar versão:', error);
            DOM.showToast('Erro ao solicitar versão: ' + error.message, 'error');
        } finally {
            DOM.showLoading(false);
        }
    }
};

window.fetchBatches = async () => {
    try {
        DOM.showLoading(true);
        
        const batches = await API.fetchBatches();
        
        DOM.showToast('Batches carregados com sucesso!');
        await loadData(true);
        return batches;
    } catch (error) {
        console.error('Erro ao carregar batches:', error);
        DOM.showToast('Erro ao carregar batches: ' + error.message, 'error');
    } finally {
        DOM.showLoading(false);
    }
};

window.confirmDeploy = async (prId) => {
    const referencePr = currentData.prs.find(p => p.id === prId);
    if (!referencePr) {
        DOM.showToast('PR não encontrado.', 'error');
        return;
    }
    
    const projectName = referencePr.project;
    
    if (confirm(`Confirmar liberação de "${projectName}" para ambiente de Teste (STG)?`)) {
        
        const sprintName = prompt("Informe a SPRINT desta liberação (ex: Sprint 143):", "Sprint ");
        if (!sprintName || sprintName.trim() === "Sprint" || sprintName.trim() === "") {
            DOM.showToast('Liberação cancelada: Sprint é obrigatória.', 'info');
            return;
        }

        let changed = false;
        
        currentData.prs.forEach(pr => {
            if (pr.project === projectName && pr.approved && pr.version && !pr.deployedToStg) {
                pr.deployedToStg = true;
                pr.deployedToStgAt = new Date().toISOString();
                pr.sprint = sprintName.trim();
                changed = true;
            }
        });

        if (changed) {
            try {
                DOM.showLoading(true);
                const result = await API.savePRs(currentData);
                currentData = result.newData;
                DOM.showToast(`Versão liberada para Teste (STG) na ${sprintName}!`);
                DOM.renderTable(currentData.prs, openEditModal);
            } catch (error) {
                DOM.showToast('Erro ao liberar versão: ' + error.message, 'error');
            } finally {
                DOM.showLoading(false);
            }
        } else {
            DOM.showToast('Nenhum PR pendente para liberar neste grupo.', 'info');
        }
    }
};

function showErrorModal(friendlyMsg, error) {
    const modal = document.getElementById('errorModal');
    if (!modal) return;
    
    document.getElementById('errorFriendlyMessage').textContent = friendlyMsg;
    
    const stack = error?.stack || error?.message || 'Detalhes indisponíveis.';
    document.getElementById('errorStack').textContent = stack;
    
    modal.style.display = 'flex';
    
    const closeBtns = modal.querySelectorAll('.close-modal');
    closeBtns.forEach(btn => {
        btn.onclick = () => modal.style.display = 'none';
    });
}

window.createGitLabIssue = async (batchId) => {
    if (confirm(`Criar issue de deploy no GitLab para esse lote de versão?`)) {
        try {
            DOM.showLoading(true);
            await GitLabService.createIssue(batchId);
            DOM.showToast('Chamado criado com sucesso no GitLab!');
            await loadData(true);
        } catch (error) {
            console.error(error);
            showErrorModal('Ocorreu um erro ao tentar criar o chamado no GitLab. Verifique o token e a conexão.', error);
        } finally {
            DOM.showLoading(false);
        }
    }
};

window.completeSprint = async (sprintName) => {
    if (confirm(`Deseja concluir a Sprint "${sprintName}"? \nIsso moverá os itens para o Histórico de Sprints.`)) {
        let changed = false;
        
        currentData.prs.forEach(pr => {
             if (pr.sprint === sprintName && pr.deployedToStg && !pr.sprintCompleted) {
                 pr.sprintCompleted = true;
                 pr.completedAt = new Date().toISOString();
                 changed = true;
             }
        });

        if (changed) {
            try {
                DOM.showLoading(true);
                const result = await API.savePRs(currentData);
                currentData = result.newData;
                DOM.showToast(`Sprint "${sprintName}" concluída e arquivada!`);
                DOM.renderTable(currentData.prs, openEditModal);
            } catch (error) {
                 DOM.showToast('Erro ao concluir sprint: ' + error.message, 'error');
            } finally {
                DOM.showLoading(false);
            }
        } else {
             DOM.showToast('Nenhum item pendente nesta Sprint.', 'info');
        }
    }
};

init();
