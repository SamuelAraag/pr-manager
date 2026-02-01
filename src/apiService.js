import { getItem } from './localStorageService.js';
import { ApiConstants } from './constants/apiConstants.js';

const API_BASE_URL = 'https://api.github.com';

const DEFAULT_CONFIG = {
    owner: 'SamuelAraag',
    repo: 'pr-manager',
    filePath: 'pr_database.json',
    branch: 'database-strategy' 
};

function getConfig() {
    const savedConfig = getItem('githubConfig');
    return { 
        ...(savedConfig || DEFAULT_CONFIG), 
        branch: 'database-strategy' 
    };
}

function getHeaders() {
    const token = getItem('githubToken');
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
}

async function fetchPRs() {
    const url = `${ApiConstants.BASE_URL}/PullRequests`;
    
    try {
        const response = await fetch(url, { 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { prs: [] };
            }
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('Dados recebidos:', data);
        
        return { prs: data };
    } catch (error) {
        console.error('Falha na requisição GET:', error);
        return null;
    }
}

async function fetchUsers() {
    const url = `${ApiConstants.BASE_URL}/Users`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
        }

        const users = await response.json();
        console.log('Usuários recebidos:', users);
        return users;
    } catch (error) {
        console.error('Falha ao buscar usuários:', error);
        return [];
    }
}

async function createPR(prData) {
    const url = `${ApiConstants.BASE_URL}/PullRequests`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(prData)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao criar PR: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao criar PR:', error);
        throw error;
    }
}

async function updatePR(prId, prData) {
    const url = `${ApiConstants.BASE_URL}/PullRequests/${prId}`;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prData)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao atualizar PR: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao atualizar PR:', error);
        throw error;
    }
}
async function requestCorrection(prId) {
    const url = `${ApiConstants.BASE_URL}/PullRequests/${prId}/request-correction`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ reason: "Correção solicitada" })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao solicitar correção: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao solicitar correção:', error);
        throw error;
    }
}


async function requestVersionBatch(prIds) {
    const url = `${ApiConstants.BASE_URL}/VersionBatches/request-version`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ prIds: prIds })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao solicitar versão em lote: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao solicitar versão em lote:', error);
        throw error;
    }
}

async function saveVersionBatch(batchData) {
    const url = `${ApiConstants.BASE_URL}/VersionBatches/save-version`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(batchData)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao salvar versão em lote: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao salvar versão em lote:', error);
        throw error;
    }
}

async function fetchBatches() {
    const url = `${ApiConstants.BASE_URL}/VersionBatches`;
    try {
        const response = await fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Falha ao buscar lotes:', error);
        return [];
    }
}

async function fetchBatchById(batchId) {
    const url = `${ApiConstants.BASE_URL}/VersionBatches/by-id/${batchId}`;
    try {
        const response = await fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('Falha ao buscar lote:', error);
        return null;
    }
}

async function releaseBatchToStaging(batchId) {
    const url = `${ApiConstants.BASE_URL}/VersionBatches/release-to-staging/${batchId}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
        });
        if (!response.ok) throw new Error(`Falha ao liberar lote: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao liberar lote:', error);
        throw error;
    }
}

async function updateBatch(id, batchData) {
    const url = `${ApiConstants.BASE_URL}/VersionBatches/${id}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(batchData)
        });
        return await response.json();
    } catch (error) {
        console.error('Falha ao atualizar lote:', error);
        throw error;
    }
}

async function approvePR(prId, approverId) {
    const url = `${ApiConstants.BASE_URL}/PullRequests/${prId}/approve`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ approverId: approverId })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao aprovar: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao aprovar PR:', error);
        throw error;
    }
}

async function markPrFixed(prId) {
    const url = `${ApiConstants.BASE_URL}/PullRequests/${prId}/mark-fixed`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao marcar como corrigido: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Falha ao marcar como corrigido:', error);
        throw error;
    }
}

async function savePRs(dataToSave, sha) {
    const { owner, repo, filePath, branch } = getConfig();
    const url = `${API_BASE_URL}/repos/${owner}/${repo}/contents/${filePath}`;
    
    dataToSave.last_updated = new Date().toISOString();
    
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(dataToSave, null, 2))));

    const body = {
        message: 'Update PR Manager Database',
        content: content,
        sha: sha,
        branch: branch
    };
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao salvar: ${errorBody.message || response.statusText}`);
        }

        const data = await response.json();
        return { newSha: data.content.sha, newData: dataToSave };
    } catch (error) {
        console.error('Falha na requisição PUT:', error);
        throw error;
    }
}

async function getAutomationConfig() {
    const url = `${ApiConstants.BASE_URL}/AutomationConfig`;
    try {
        const response = await fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('Falha ao buscar config:', error);
        return null;
    }
}

async function saveAutomationConfig(configData) {
    const url = `${ApiConstants.BASE_URL}/AutomationConfig`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(configData)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao salvar config: ${errorBody.message || response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Falha ao salvar config:', error);
        throw error;
    }
}

export { fetchPRs, fetchUsers, createPR, updatePR, requestCorrection, markPrFixed, approvePR, requestVersionBatch, saveVersionBatch, fetchBatches, fetchBatchById, releaseBatchToStaging, updateBatch, savePRs, getAutomationConfig, saveAutomationConfig };
