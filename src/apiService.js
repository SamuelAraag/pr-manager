import { getItem } from './localStorageService.js';

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
    const url = 'https://localhost:7268/api/PullRequests';
    
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
    const url = 'https://localhost:7268/api/Users';
    
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
    const url = 'https://localhost:7268/api/PullRequests';
    
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
    const url = `https://localhost:7268/api/PullRequests/${prId}`;
    
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
    const url = `https://localhost:7268/api/PullRequests/${prId}/request-correction`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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

async function approvePR(prId, approverId) {
    const url = `https://localhost:7268/api/PullRequests/${prId}/approve`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
    const url = `https://localhost:7268/api/PullRequests/${prId}/mark-fixed`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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

export { fetchPRs, fetchUsers, createPR, updatePR, requestCorrection, markPrFixed, approvePR, savePRs };
