# PR Manager - Local GitOps

Uma aplicação simples e eficiente para controle de Pull Requests, baseada na estratégia de armazenamento direto no GitHub.

## Como usar

1.  Abra o arquivo `index.html` em qualquer navegador.
2.  Na primeira execução, clique no ícone de engrenagem e configure seu **GitHub Personal Access Token** (PAT).
    *   O token precisa de permissão de `repo` para ler e escrever arquivos.
3.  Adicione seus PRs usando o botão "Novo PR".
4.  Cada vez que você salvar, a aplicação fará um commit automático no repositório configurado no arquivo `src/apiService.js`.

## Configurações

Para mudar o repositório onde os dados são salvos, altere a constante `DEFAULT_CONFIG` no arquivo `src/apiService.js`:

```javascript
const DEFAULT_CONFIG = {
    owner: 'SamuelAraag',
    repo: 'ToDo-List',
    filePath: 'pr_database.json',
    branch: 'main'
};
```

## Tecnologias
*   HTML5 / CSS3 (Dark Mode / Glassmorphism)
*   Vanilla JavaScript (ES6 Modules)
*   GitHub REST API v3
*   LocalStorage para persistência de tokens
