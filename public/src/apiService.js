// apiService.js
import { getItem } from './localStorageService.js';

const API_BASE_URL = 'https://api.github.com';

// These could be configurable via a setup modal/localStorage
const DEFAULT_CONFIG = {
    owner: 'SamuelAraag',
    repo: 'pr-manager',
    filePath: 'pr_database.json',
    branch: 'main' // Or another branch
};

function getConfig() {
    const savedConfig = getItem('githubConfig');
    return savedConfig || DEFAULT_CONFIG;
}

function getHeaders() {
    const token = getItem('githubToken');
    return {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    };
}

async function fetchPRs() {
    const { owner, repo, filePath, branch } = getConfig();
    const url = `${API_BASE_URL}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    
    try {
        const response = await fetch(url, { 
            headers: getHeaders(),
            cache: 'no-store'
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                return { sha: null, data: { prs: [] } };
            }
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }
        
        const fileData = await response.json();
        const decodedContent = decodeURIComponent(atob(fileData.content));

        if (decodedContent.trim() === '') {
            return { sha: fileData.sha, data: { prs: [] } };
        }

        const data = JSON.parse(decodedContent);
        return { sha: fileData.sha, data: data };
    } catch (error) {
        console.error('Falha na requisição GET:', error);
        return { sha: null, data: null };
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

export { fetchPRs, savePRs };
