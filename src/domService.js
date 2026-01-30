import { getItem } from './localStorageService.js';

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function renderTable(prs, onEdit) {
    const openPrs = prs.filter(p => !p.approved);
    const approvedPrs = prs.filter(p => p.approved);

    renderOpenTable(openPrs, 'openPrTableBody', onEdit);
    renderApprovedTables(approvedPrs, 'dashboardApproved', onEdit);

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderOpenTable(data, containerId, onEdit) {
    const body = document.getElementById(containerId);
    if (!body) return;
    
    body.innerHTML = '';

    if (data.length === 0) {
        body.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum PR pendente.</td></tr>';
        return;
    }

    const grouped = data.reduce((acc, pr) => {
        const project = pr.project || 'Outros';
        if (!acc[project]) acc[project] = [];
        acc[project].push(pr);
        return acc;
    }, {});

    const projectNames = Object.keys(grouped).sort();

    projectNames.forEach(projectName => {
        const projectPrs = grouped[projectName];
        const headerContent = `${projectName} <span class="badge">${projectPrs.length}</span>`;

        const headerRow = document.createElement('tr');
        headerRow.className = 'group-header';
        
        headerRow.innerHTML = `
            <td colspan="6">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight: 600;">${headerContent}</div>
                </div>
            </td>
        `;
        body.appendChild(headerRow);

        projectPrs.forEach((pr) => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td><span class="tag">${pr.project || '-'}</span></td>
                <td style="font-weight: 500;">${pr.summary || '-'}</td>
                <td>${pr.dev || '-'}</td>
                <td><span class="status-badge" style="background: ${pr.reqVersion === 'ok' ? '#238636' : '#30363d'}">${pr.reqVersion || '-'}</span></td>
                <td>
                    <div style="display: flex; gap: 0.8rem;">
                        ${pr.taskLink ? `<a href="${pr.taskLink}" target="_blank" class="link-icon" title="Link Task"><i data-lucide="external-link" style="width: 16px;"></i></a>` : ''}
                        ${pr.prLink ? `<a href="${pr.prLink}" target="_blank" class="link-icon" title="Link PR"><i data-lucide="git-pull-request" style="width: 16px;"></i></a>` : ''}
                    </div>
                </td>
                <td>
                    <button class="btn btn-outline edit-btn" style="padding: 0.4rem;">
                        <i data-lucide="edit-3" style="width: 14px;"></i>
                    </button>
                </td>
            `;

            const editBtn = tr.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => onEdit(pr));
            
            body.appendChild(tr);
        });
    });
}

function renderApprovedTables(data, containerId, onEdit) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary); background: #161b22; border: 1px solid #30363d; border-radius: 6px;">Nenhum PR aprovado.</div>';
        return;
    }

    const grouped = data.reduce((acc, pr) => {
        const project = pr.project || 'Outros';
        if (!acc[project]) acc[project] = [];
        acc[project].push(pr);
        return acc;
    }, {});

    const projectNames = Object.keys(grouped).sort();
    const currentUser = getItem('appUser');

    projectNames.forEach((projectName, index) => {
        const projectPrs = grouped[projectName];
        const isRequestingVersion = projectPrs.some(p => p.versionRequested);
        
        // Header Logic
        let headerStyle = '';
        let leftContent = `${projectName} <span class="badge">${projectPrs.length}</span>`;
        let rightContent = '';
        let versionInputs = '';
        
        const hasVersionInfo = projectPrs.some(p => p.version);
        
        if (hasVersionInfo) {
            const info = projectPrs.find(p => p.version);
            
            // Right Side: Version & Gitlab Link
            let gitlabLink = '';
            if (info.gitlabIssueLink) {
                 gitlabLink = `
                    <a href="${info.gitlabIssueLink}" target="_blank" class="btn" style="background-color: #FC6D26; color: white; padding: 0.2rem 0.6rem; font-size: 0.75rem; margin-left: 10px; display: inline-flex; align-items: center; gap: 5px; text-decoration: none; border-radius: 4px;">
                        <i data-lucide="gitlab" style="width: 14px;"></i>
                        Ver Chamado
                    </a>
                `;
            }

            rightContent += ` 
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="tag" style="background:#238636; color:white;">v${info.version}</span>
                    ${gitlabLink}
                </div>
            `;
        }

        if (isRequestingVersion) {
            const devCounts = projectPrs.reduce((acc, pr) => {
                acc[pr.dev] = (acc[pr.dev] || 0) + 1;
                return acc;
            }, {});
            
            const majorityDev = Object.keys(devCounts).reduce((a, b) => devCounts[a] > devCounts[b] ? a : b);
            
            if (currentUser === majorityDev) {
                // Red highlight logic
                headerStyle = 'background-color: rgba(218, 54, 51, 0.2); border: 1px solid #da3633; color: #ff7b72;'; 
                
                leftContent += ` <span style="font-size:0.75rem; margin-left:10px; color:#ff7b72;">(Ação Necessária: Versão)</span>`;
                
                versionInputs = `
                    <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <input type="text" placeholder="Versão (ex: 1.0.0)" class="version-input-group" id="v_ver_${projectName.replace(/\s/g, '')}" style="font-size:0.85rem; padding:0.4rem;">
                        <input type="url" placeholder="Pipeline Link" class="version-input-group" id="v_pipe_${projectName.replace(/\s/g, '')}" style="font-size:0.85rem; padding:0.4rem;">
                        <input type="text" placeholder="Rollback" class="version-input-group" id="v_roll_${projectName.replace(/\s/g, '')}" style="font-size:0.85rem; padding:0.4rem;">
                        <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size:0.8rem;" onclick="window.saveGroupVersion('${projectName}')">Salvar</button>
                    </div>
                `;
            } else {
                leftContent += ` <span style="font-size:0.75rem; margin-left:10px; color:var(--text-secondary);">(Aguardando: ${majorityDev})</span>`;
            }
        } else if (hasVersionInfo && currentUser === 'Samuel Santos') {
             // Create Issue Button
             const info = projectPrs.find(p => p.version);
             if (!info.gitlabIssueLink) {
                leftContent += `
                    <button class="btn" style="background-color: #6C5CE7; color: white; padding: 0.3rem 0.8rem; font-size: 0.75rem; display: flex; align-items: center; gap: 5px; margin-left: 15px;" onclick="window.createGitLabIssue('${projectName}')">
                        <i data-lucide="gitlab" style="width: 14px;"></i>
                        Criar Chamado
                    </button>
                `;
             }
        }
        
        // Create SEPARATE CARD for this project
        const card = document.createElement('div');
        card.className = 'data-card';
        card.style.marginBottom = '2rem'; 

        // REQUEST VERSION BUTTON LOGIC
        // Logic: Show button only if NO version info exists and user is NOT requesting yet.
        // It replaces the global button. Each group manages its own state.
        let requestVersionBtn = '';
        if (!hasVersionInfo && !isRequestingVersion) {
             requestVersionBtn = `
                <button class="btn btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.75rem; display: flex; align-items: center; gap: 5px; margin-left:15px;" onclick="window.requestVersion('${projectName}')">
                    <i data-lucide="package-check" style="width: 14px;"></i>
                    Solicitar Versão
                </button>
            `;
        }

        // Project Header Div
        const headerDiv = document.createElement('div');
        headerDiv.style.padding = '1rem';
        headerDiv.style.borderBottom = '1px solid #30363d';
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        
        if (headerStyle) {
             headerDiv.style.cssText += headerStyle;
        }
        
        // Add requestVersionBtn to rightContent or separate?
        // User asked "ao lado do ver chamado" (beside view issue).
        // Since view issue only appears AFTER version/issue exists, this button appears BEFORE.
        // So we can append it to rightContent.
        
        rightContent += requestVersionBtn;

        headerDiv.innerHTML = `
            <div style="display:flex; align-items:center;">${leftContent}</div>
            <div style="display:flex; align-items:center;">${rightContent}</div>
        `;

        // Table logic
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Projeto</th>
                    <th>Resumo</th>
                    <th>Dev</th>
                    <th>Solicitada</th>
                    <th>Links</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');
        projectPrs.forEach(pr => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="tag">${pr.project || '-'}</span></td>
                <td style="font-weight: 500;">${pr.summary || '-'}</td>
                <td>${pr.dev || '-'}</td>
                <td><span class="status-badge" style="background: ${pr.reqVersion === 'ok' ? '#238636' : '#30363d'}">${pr.reqVersion || '-'}</span></td>
                <td>
                    <div style="display: flex; gap: 0.8rem;">
                        ${pr.taskLink ? `<a href="${pr.taskLink}" target="_blank" class="link-icon" title="Link Task"><i data-lucide="external-link" style="width: 16px;"></i></a>` : ''}
                        ${pr.prLink ? `<a href="${pr.prLink}" target="_blank" class="link-icon" title="Link PR"><i data-lucide="git-pull-request" style="width: 16px;"></i></a>` : ''}
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Assemble
        card.appendChild(headerDiv);
        
        if (versionInputs) {
            const inputsDiv = document.createElement('div');
            inputsDiv.style.padding = '1rem';
            inputsDiv.style.background = 'rgba(218, 54, 51, 0.05)';
            inputsDiv.innerHTML = versionInputs;
            card.appendChild(inputsDiv);
        }

        tableContainer.appendChild(table);
        card.appendChild(tableContainer);
        container.appendChild(card);
    });
}

function showLoading(show) {
    const displayStyle = show ? 'none' : 'block';
    const loadingStyle = show ? 'flex' : 'none';

    const dashboard = document.getElementById('dashboard');
    const dashboardApproved = document.getElementById('dashboardApproved');
    if (dashboard) dashboard.style.display = displayStyle;
    if (dashboardApproved) dashboardApproved.style.display = displayStyle;

    const loadingOpen = document.getElementById('loadingOpen');
    const loadingApproved = document.getElementById('loadingApproved'); 
    
    if (loadingOpen) loadingOpen.style.display = loadingStyle;
    if (loadingApproved) loadingApproved.style.display = loadingStyle;
}

export { showToast, renderTable, showLoading };
