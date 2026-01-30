// domService.js

/**
 * Exibe um toast de notificação
 * @param {string} message 
 * @param {string} type 'success' | 'error'
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * Renderiza a tabela de PRs
 * @param {Array} prs 
 * @param {Function} onEdit callback ao clicar em editar
 */
function renderTable(prs, onEdit) {
    const openPrs = prs.filter(p => !p.approved);
    const approvedPrs = prs.filter(p => p.approved);

    renderGroupedTable(openPrs, 'openPrTableBody', onEdit);
    renderGroupedTable(approvedPrs, 'approvedPrTableBody', onEdit);

    // Refresh icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderGroupedTable(data, containerId, onEdit) {
    const body = document.getElementById(containerId);
    if (!body) return;
    
    body.innerHTML = '';

    if (data.length === 0) {
        body.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum PR nesta seção.</td></tr>';
        return;
    }

    // Group by Project
    const grouped = data.reduce((acc, pr) => {
        const project = pr.project || 'Outros';
        if (!acc[project]) acc[project] = [];
        acc[project].push(pr);
        return acc;
    }, {});

    // Sort Project Names
    const projectNames = Object.keys(grouped).sort();

    projectNames.forEach(projectName => {
        // Add Project Header
        const headerRow = document.createElement('tr');
        headerRow.className = 'group-header';
        headerRow.innerHTML = `<td colspan="8">${projectName} <span class="badge">${grouped[projectName].length}</span></td>`;
        body.appendChild(headerRow);

        // Add PR Rows
        grouped[projectName].forEach((pr) => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td><span class="tag">${pr.project || '-'}</span></td>
                <td style="font-weight: 500;">${pr.summary || '-'}</td>
                <td style="text-align: center;">
                    ${pr.rev ? '<i data-lucide="check-circle" style="width: 16px; color: #58a6ff;"></i>' : '-'}
                </td>
                <td>${pr.dev || '-'}</td>
                <td>
                    <div style="font-size: 0.85rem;">
                        <span style="color: #aff5b4;">${pr.version || '-'}</span>
                        ${pr.rollback ? `<br><small style="color: #ffa198;">RB: ${pr.rollback}</small>` : ''}
                    </div>
                </td>
                <td><span class="status-badge" style="background: ${pr.reqVersion === 'ok' ? '#238636' : '#30363d'}">${pr.reqVersion || '-'}</span></td>
                <td>
                    <div style="display: flex; gap: 0.8rem;">
                        ${pr.prLink ? `<a href="${pr.prLink}" target="_blank" class="link-icon" title="Link PR"><i data-lucide="git-pull-request" style="width: 16px;"></i></a>` : ''}
                        ${pr.taskLink ? `<a href="${pr.taskLink}" target="_blank" class="link-icon" title="Link Task"><i data-lucide="external-link" style="width: 16px;"></i></a>` : ''}
                        ${pr.docLink ? `<a href="${pr.docLink}" target="_blank" class="link-icon" title="Docs"><i data-lucide="file-text" style="width: 16px;"></i></a>` : ''}
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

function showLoading(show) {
    const displayStyle = show ? 'none' : 'block';
    const loadingStyle = show ? 'flex' : 'none';

    // Tables
    const dashboard = document.getElementById('dashboard');
    const dashboardApproved = document.getElementById('dashboardApproved');
    if (dashboard) dashboard.style.display = displayStyle;
    if (dashboardApproved) dashboardApproved.style.display = displayStyle;

    // Loaders
    const loadingOpen = document.getElementById('loadingOpen');
    const loadingApproved = document.getElementById('loadingApproved'); 
    
    // Fallback if elements not found (during transition)
    if (loadingOpen) loadingOpen.style.display = loadingStyle;
    if (loadingApproved) loadingApproved.style.display = loadingStyle;
}

export { showToast, renderTable, showLoading };
