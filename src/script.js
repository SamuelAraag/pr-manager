import * as LocalStorage from './localStorageService.js';
import * as API from './apiService.js';
import * as DOM from './domService.js';
import { GitLabService } from './gitlabService.js';
import { EffectService } from './effectService.js';

let currentData = { prs: [] };
let currentSha = null;
const validDevs = ['Rodrigo Barbosa', 'Itallo Cerqueira', 'Marcos Paulo', 'Samuel Santos', 'Kemilly Alvez'];

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
            loadData();
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

function showProfileSelection() {
    profileScreen.style.display = 'flex';
}

function openSetupModal() {
    ghTokenInput.value = LocalStorage.getItem('githubToken') || '';
    document.getElementById('glTokenInput').value = LocalStorage.getItem('gitlabToken') || '';
    setupModal.style.display = 'flex';
}

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

document.querySelectorAll('.profile-item').forEach(item => {
    item.addEventListener('click', () => {
        const userName = item.getAttribute('data-user');
        
        if (userName === 'Samuel Santos') {
            EffectService.triggerGodMode();
        }

        LocalStorage.setItem('appUser', userName);
        updateUserDisplay(userName);
        profileScreen.style.display = 'none';
        
        const token = LocalStorage.getItem('githubToken');
        if (!token) {
            setupModal.style.display = 'flex';
        } else {
            loadData();
        }
    });
});

async function loadData() {
    const token = LocalStorage.getItem('githubToken');
    if (!token) {
        DOM.showToast('Token não configurado. Por favor, adicione o token do GitHub.', 'error');
        setupModal.style.display = 'flex';
        return;
    }

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

    if (!confirm('Aprovar este PR? Os campos principais serão bloqueados.')) {
        return;
    }

    const index = currentData.prs.findIndex(p => p.id === prId);
    if (index !== -1) {
        currentData.prs[index].approved = true;
        currentData.prs[index].approvedBy = 'Samuel Santos';
        currentData.prs[index].approvedAt = new Date().toISOString();
        currentData.prs[index].needsCorrection = false; 
        currentData.prs[index].correctionReason = null;
        currentData.prs[index].reqVersion = 'ok';
        
        try {
            DOM.showLoading(true);
            const result = await API.savePRs(currentData, currentSha);
            currentData = result.newData;
            currentSha = result.newSha;
            
            DOM.showToast('PR Aprovado com sucesso!');
            DOM.renderTable(currentData.prs, openEditModal);
            
            const prModal = document.getElementById('prModal');
            if (prModal && prModal.style.display === 'flex') {
                prModal.style.display = 'none';
            }
        } catch (error) {
            DOM.showToast('Erro ao aprovar: ' + error.message, 'error');
        } finally {
            DOM.showLoading(false);
        }
    }
};

window.requestCorrection = async (prId) => {
    if (!prId) return;

    if (!confirm('Solicitar correção para este PR? (O status mudará para "Ajustes")')) {
        return;
    }

    const index = currentData.prs.findIndex(p => p.id === prId);
    if (index !== -1) {
        currentData.prs[index].needsCorrection = true;
        currentData.prs[index].correctionReason = 'Verificar comentários no PR'; 
        currentData.prs[index].approved = false; 
        currentData.prs[index].reqVersion = 'changes_requested';
        
        try {
            DOM.showLoading(true);
            const result = await API.savePRs(currentData, currentSha);
            currentData = result.newData;
            currentSha = result.newSha;
            
            DOM.showToast('Correção solicitada!');
            DOM.renderTable(currentData.prs, openEditModal);
        } catch (error) {
            DOM.showToast('Erro: ' + error.message, 'error');
        } finally {
            DOM.showLoading(false);
        }
    }
};

window.markPrFixed = async (prId) => {
    if (!prId) return;

    const index = currentData.prs.findIndex(p => p.id === prId);
    if (index !== -1) {
        currentData.prs[index].needsCorrection = false;
        currentData.prs[index].correctionReason = null;
        currentData.prs[index].reqVersion = 'ok';
        
        try {
            DOM.showLoading(true);
            const result = await API.savePRs(currentData, currentSha);
            currentData = result.newData;
            currentSha = result.newSha;
            
            DOM.showToast('PR marcado como corrigido!');
            DOM.renderTable(currentData.prs, openEditModal);
        } catch (error) {
            DOM.showToast('Erro: ' + error.message, 'error');
        } finally {
            DOM.showLoading(false);
        }
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
    if (e.target.value && !validDevs.includes(e.target.value)) {
        DOM.showToast('Desenvolvedor inválido. Escolha um da lista.', 'error');
        e.target.value = '';
    }
});

document.querySelectorAll('.close-btn, .close-modal').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

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

prForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const devInputForForm = document.getElementById('dev');
    const prId = document.getElementById('prId').value;

    if (!validDevs.includes(devInputForForm.value)) {
        DOM.showToast('Por favor, selecione um desenvolvedor válido da lista.', 'error');
        devInputForForm.focus();
        return;
    }

    try {
        DOM.showLoading(true);
        
        await loadData();
        
        const prId = document.getElementById('prId').value;
        const prLinkValue = document.getElementById('prLink').value;

        const pr = {
            id: prId || prLinkValue,
            project: document.getElementById('project').value,
            dev: devInputForForm.value,
            summary: document.getElementById('summary').value,
            prLink: prLinkValue,
            taskLink: document.getElementById('taskLink').value,
            teamsLink: document.getElementById('teamsLink').value,
            reqVersion: 'ok',
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


window.saveGroupVersion = async (batchId) => {
    // We rely solely on batchId for looking up DOM elements and Data
    const uniqueId = batchId;
    
    // Get Elements using batchId
    const elVersion = document.getElementById(`v_ver_${uniqueId}`);
    const elPipeline = document.getElementById(`v_pipe_${uniqueId}`);
    const elRollback = document.getElementById(`v_roll_${uniqueId}`);

    if (!elVersion || !elPipeline || !elRollback) {
        DOM.showToast('Erro interno: Campos de formulário não encontrados (ID mismatch).', 'error');
        return;
    }

    const version = elVersion.value.trim();
    const pipeline = elPipeline.value.trim();
    const rollback = elRollback.value.trim();

    // Reset styles
    [elVersion, elPipeline, elRollback].forEach(el => el.style.border = '1px solid #30363d');

    let hasError = false;

    // Required check
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

    // Version Regex Validation
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

    // Find the PRs for this batch to get project name and confirm
    const batchPrs = currentData.prs.filter(pr => pr.versionBatchId === batchId && pr.approved);
    
    if (batchPrs.length === 0) {
        DOM.showToast('Nenhum PR encontrado para este lote.', 'error');
        return;
    }

    const projectName = batchPrs[0].project; // Derive project name from data

    if (confirm(`Aplicar versão ${version} para este lote de ${batchPrs.length} PRs de "${projectName}"?`)) {
        let changed = false;
        
        currentData.prs.forEach(pr => {
            if (pr.versionBatchId === batchId && pr.approved) {
                pr.version = version;
                pr.pipelineLink = pipeline;
                pr.rollback = rollback;
                pr.versionRequested = false;
                pr.versionGroupStatus = 'done';
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

window.requestVersion = async (prId) => {
    const referencePr = currentData.prs.find(p => p.id === prId);
    if (!referencePr) {
        DOM.showToast('PR não encontrado.', 'error');
        return;
    }
    
    const projectName = referencePr.project;
    
    // Only target backlog items (no version, no batch)
    const prs = currentData.prs.filter(p => p.project === projectName && p.approved && !p.version && !p.versionBatchId);
    console.log('PRs encontrados:', prs);

    debugger
    if (!prs.length) return;

    if (confirm(`Solicitar versão para ${prs.length} PRs de "${projectName}"?`)) {
        let changed = false;
        const newBatchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        currentData.prs.forEach(pr => {
            if (pr.project === projectName && pr.approved && !pr.version && !pr.versionBatchId) {
                pr.versionRequested = true;
                pr.versionBatchId = newBatchId;
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
             DOM.showToast('Nenhum PR para solicitar versão neste grupo.', 'info');
        }
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
                const result = await API.savePRs(currentData, currentSha);
                currentData = result.newData;
                currentSha = result.newSha;
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

window.createGitLabIssue = async (prId) => {
    const token = LocalStorage.getItem('gitlabToken');
    if (!token) {
        DOM.showToast('Configure o token do GitLab para continuar.', 'error');
        openSetupModal();
        document.getElementById('glTokenInput').focus();
        return;
    }

    const referencePr = currentData.prs.find(p => p.id === prId);
    if (!referencePr) {
        DOM.showToast('PR não encontrado.', 'error');
        return;
    }

    if (!referencePr.version) {
        DOM.showToast('Nenhuma versão definida para este grupo.', 'error');
        return;
    }

    const data = {
        modulo: referencePr.project,
        versao: referencePr.version,
        pipeline_url: referencePr.pipelineLink || 'N/A',
        rollback: referencePr.rollback
    };

    if (confirm(`Criar issue de deploy no GitLab para "${referencePr.project} - ${referencePr.version}"?`)) {
        try {
            DOM.showLoading(true);
            let result = await GitLabService.createIssue(token, data);
            
            currentData.prs.forEach(pr => {
                let isSameProject = pr.project === referencePr.project;
                let isApproved = pr.approved;
                let isSameVersionBatch = pr.versionBatchId === referencePr.versionBatchId;
                
                if (isSameProject && isApproved && isSameVersionBatch) {
                    pr.gitlabIssueLink = result.web_url;
                }
            });

            await API.savePRs(currentData, currentSha);
            DOM.showToast('Chamado criado com sucesso no GitLab!');
            DOM.renderTable(currentData.prs, openEditModal);
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
                const result = await API.savePRs(currentData, currentSha);
                currentData = result.newData;
                currentSha = result.newSha;
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
