# Como Acessar o Banco de Dados SQLite

## 📍 Localização do Banco

O banco de dados SQLite é criado automaticamente quando você roda a API pela primeira vez. O arquivo fica em:

```
/Users/samuelaraag/Downloads/documentos/projetos/pr-manager/backend/PRManager.API/prmanager.db
```

## 🔧 Opções para Acessar o Banco

### Opção 1: SQLite CLI (Terminal)

Se você tem o SQLite instalado no Mac, pode acessar via terminal:

```bash
# Navegar até o diretório
cd /Users/samuelaraag/Downloads/documentos/projetos/pr-manager/backend/PRManager.API

# Abrir o banco de dados
sqlite3 prmanager.db

# Comandos úteis dentro do SQLite:
.tables                    # Listar todas as tabelas
.schema Users              # Ver estrutura da tabela Users
SELECT * FROM Users;       # Ver todos os usuários
SELECT * FROM PullRequests; # Ver todos os PRs
SELECT * FROM Sprints;     # Ver sprints
.quit                      # Sair
```

### Opção 2: DB Browser for SQLite (GUI - Recomendado)

**Melhor opção para visualizar e editar dados facilmente!**

1. **Instalar o DB Browser**:
   ```bash
   brew install --cask db-browser-for-sqlite
   ```

2. **Abrir o banco**:
   - Abra o DB Browser for SQLite
   - File → Open Database
   - Navegue até: `/Users/samuelaraag/Downloads/documentos/projetos/pr-manager/backend/PRManager.API/prmanager.db`

3. **Funcionalidades**:
   - ✅ Visualizar dados em formato de tabela
   - ✅ Editar registros
   - ✅ Executar queries SQL
   - ✅ Ver estrutura das tabelas
   - ✅ Exportar dados

### Opção 3: VS Code Extension

Instale a extensão **SQLite Viewer** no VS Code:

1. Abra VS Code
2. Vá em Extensions (Cmd+Shift+X)
3. Procure por "SQLite Viewer" ou "SQLite"
4. Instale a extensão
5. Clique com botão direito no arquivo `prmanager.db` → "Open Database"

### Opção 4: TablePlus (Profissional)

Se você usa TablePlus (pago, mas muito bom):

1. Abra TablePlus
2. Create a new connection → SQLite
3. Selecione o arquivo `prmanager.db`

## 📊 Estrutura do Banco

O banco tem 3 tabelas principais:

### **Users**
- Id, Name, Email, PasswordHash, Role
- GitHubTokenEncrypted, GitLabTokenEncrypted
- CreatedAt, LastLoginAt

### **PullRequests**
- Id, ExternalId, Project, Summary
- DevId (FK → Users), ApprovedById (FK → Users)
- PrLink, TaskLink, TeamsLink
- Status, ReqVersion, Approved, ApprovedAt
- NeedsCorrection, CorrectionReason
- VersionRequested, VersionBatchId, Version
- PipelineLink, Rollback, GitlabIssueLink
- DeployedToStg, DeployedToStgAt
- SprintId (FK → Sprints)
- CreatedAt, UpdatedAt

### **Sprints**
- Id, Name, StartDate, EndDate, IsActive

## 🔍 Queries Úteis

```sql
-- Ver todos os usuários
SELECT Id, Name, Email, Role FROM Users;

-- Ver todos os PRs com nome do desenvolvedor
SELECT 
    pr.Id,
    pr.Project,
    pr.Summary,
    u.Name as Dev,
    pr.Status,
    pr.Approved,
    pr.CreatedAt
FROM PullRequests pr
JOIN Users u ON pr.DevId = u.Id
ORDER BY pr.CreatedAt DESC;

-- Ver PRs aprovados
SELECT * FROM PullRequests WHERE Approved = 1;

-- Ver PRs que precisam correção
SELECT * FROM PullRequests WHERE NeedsCorrection = 1;

-- Ver sprint ativa
SELECT * FROM Sprints WHERE IsActive = 1;

-- Contar PRs por desenvolvedor
SELECT 
    u.Name,
    COUNT(pr.Id) as TotalPRs
FROM Users u
LEFT JOIN PullRequests pr ON u.Id = pr.DevId
GROUP BY u.Name;
```

## 🗑️ Resetar o Banco

Se você quiser resetar o banco de dados (apagar tudo e recriar):

```bash
cd /Users/samuelaraag/Downloads/documentos/projetos/pr-manager/backend/PRManager.API

# Deletar o banco
rm -f prmanager.db prmanager.db-shm prmanager.db-wal

# Rodar a API novamente para recriar
dotnet run
```

O banco será recriado automaticamente com os dados seed (5 usuários + Sprint 27).

## 📝 Configuração

A configuração do banco está em `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=prmanager.db"
  }
}
```

Se quiser mudar o nome ou local do arquivo, edite essa linha.

## 🔄 Migrar para Outro Banco (Futuro)

Para produção, você pode facilmente migrar para PostgreSQL ou SQL Server:

1. Instalar o pacote NuGet apropriado
2. Mudar a connection string em `appsettings.json`
3. Atualizar `Program.cs` para usar `UseNpgsql()` ou `UseSqlServer()`
4. Rodar migrations

O código permanece o mesmo, apenas a configuração muda!
