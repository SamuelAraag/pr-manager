# Plano de Implementação: Tabela de Versões Liberadas (STG)

Este documento descreve o plano para adicionar a terceira fase do fluxo de PRs: "Versões Liberadas para STG".

## 1. Fluxo de Trabalho Proposto
Atualmente:
1.  **Aberto**: PR criado, aguardando revisão.
2.  **Aprovado**: PR aprovado, aguardando versionamento e criação de chamado no GitLab.

Novo Estado:
3.  **Liberado (STG)**: PR versionado e com chamado criado, que foi marcado como "Entregue" ou "Liberado para Teste".

## 2. Alterações de Estrutura de Dados
Vamos introduzir uma nova flag nos objetos PR: `deployedToStg` (booleano).
- **PRs Abertos**: `!approved`
- **PRs Aprovados (Fila de Deploy)**: `approved == true` E `!deployedToStg`
- **PRs em Teste (STG)**: `approved == true` E `deployedToStg == true`

## 3. Alterações na Interface (UI)

### A. Tabela de Aprovados (Modificação)
- Adicionar um botão "Confirmar Liberação" (ou ícone de check/foguete) no cabeçalho do projeto.
- Este botão só aparecerá quando **já houver versão e link do GitLab** gerados (garantindo que o fluxo foi seguido).

### B. Nova Seção: "Versões em Teste (STG)"
- Localizada abaixo da seção de Aprovados.
- Estrutura visual similar (Cards por Projeto).
- **Conteúdo do Card**:
    - **Header**: Nome do Projeto, Versão, Link do Chamado GitLab (destacado), Info de Rollback.
    - **Tabela**: Lista simplificada dos PRs inclusos naquela versão.
- **Ação**: Botão para "Arquivar" ou "Concluir" (caso queira limpar a lista futuramente, opcional por enquanto).

## 4. Passos de Implementação (Técnico)

1.  **`index.html`**:
    - Adicionar container `<div id="dashboardTesting">` após o `dashboardApproved`.
    - Adicionar título "Versões em Teste".

2.  **`domService.js`**:
    - Atualizar `renderTable` para filtrar os 3 grupos de dados.
    - Criar função `renderTestingTable` (similar a `renderApprovedTables`, mas focada em visualização de release).
    - Atualizar `renderApprovedTables` para incluir o botão de ação `window.confirmDeploy(projectName)`.

3.  **`script.js`**:
    - Criar função `window.confirmDeploy(projectName)`.
    - Esta função irá iterar sobre os PRs do projeto aprovado e setar `deployedToStg = true`, salvando no banco.

---
**Iniciando implementação imediata...**
