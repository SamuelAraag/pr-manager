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
    const body = document.getElementById('prTableBody');
    body.innerHTML = '';

    if (prs.length === 0) {
        body.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Nenhum PR encontrado.</td></tr>';
        return;
    }

    prs.forEach((pr, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><span class="tag">${pr.project || '-'}</span></td>
            <td style="font-weight: 500;">${pr.summary || '-'}</td>
            <td style="color: var(--text-secondary);">${pr.rev || '-'}</td>
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
                <button class="btn btn-outline edit-btn" style="padding: 0.4rem;" data-index="${index}">
                    <i data-lucide="edit-3" style="width: 14px;"></i>
                </button>
            </td>
        `;

        const editBtn = tr.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => onEdit(pr));
        
        body.appendChild(tr);
    });

    // Refresh icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
    document.getElementById('dashboard').style.display = show ? 'none' : 'block';
}

export { showToast, renderTable, showLoading };
