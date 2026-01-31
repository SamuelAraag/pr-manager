# Sistema de Configuração de Automação

## 📋 Visão Geral

O sistema de configuração permite armazenar e gerenciar tokens e configurações de automação de forma segura. **Todos os tokens** (GitHub e GitLab) são armazenados no banco de dados com criptografia AES.

## 🔐 Configurações Disponíveis

### **Tokens de Integração (Banco de Dados)**
Todos armazenados na tabela `AutomationConfigs` com criptografia AES:

- **GitHub.Token** - Token de API do GitHub
- **GitLab.Token** - Token de API do GitLab  
- **GitLab.Url** - URL base do GitLab
- **GitLab.ProjectId** - ID do projeto GitLab para criar issues

## 🚀 Como Configurar

### **Configurar Tokens via API**

Todos os tokens (GitHub e GitLab) são configurados da mesma forma via API.

#### **1. Login como Admin ou Gestor:**
```bash
curl -X POST http://localhost:5231/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "samuel.santos@company.com",
    "password": "password123"
  }'
```

#### **2. Configurar Token do GitHub:**
```bash
curl -X PUT http://localhost:5231/api/automationconfig/GitHub.Token \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "ghp_seu_token_github_aqui",
    "description": "GitHub API token for repository operations"
  }'
```

#### **3. Configurar Token do GitLab:**
```bash
curl -X PUT http://localhost:5231/api/automationconfig/GitLab.Token \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "glpat-seu_token_gitlab_aqui",
    "description": "GitLab API token for creating issues"
  }'
```

3. **Configurar Project ID do GitLab:**
```bash
curl -X PUT http://localhost:5231/api/automationconfig/GitLab.ProjectId \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "12345",
    "description": "GitLab project ID"
  }'
```

4. **Configurar URL do GitLab (se necessário):**
```bash
curl -X PUT http://localhost:5231/api/automationconfig/GitLab.Url \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "https://gitlab.com",
    "description": "GitLab base URL"
  }'
```

## 📡 Endpoints da API

### **GET /api/automationconfig**
Lista todas as configurações (valores criptografados aparecem como `***ENCRYPTED***`)

**Permissões:** Admin, Gestor

```bash
curl -X GET http://localhost:5231/api/automationconfig \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**
```json
[
  {
    "id": 1,
    "key": "GitLab.Url",
    "value": "https://gitlab.com",
    "description": "GitLab base URL",
    "isEncrypted": false,
    "createdAt": "2026-01-31T15:00:00Z",
    "updatedAt": "2026-01-31T15:00:00Z"
  },
  {
    "id": 2,
    "key": "GitLab.Token",
    "value": "***ENCRYPTED***",
    "description": "GitLab API token",
    "isEncrypted": true,
    "createdAt": "2026-01-31T15:00:00Z",
    "updatedAt": "2026-01-31T15:00:00Z"
  }
]
```

### **GET /api/automationconfig/{key}**
Obtém uma configuração específica

**Permissões:** Admin, Gestor

```bash
curl -X GET http://localhost:5231/api/automationconfig/GitLab.Token \
  -H "Authorization: Bearer SEU_TOKEN"
```

### **POST /api/automationconfig**
Cria uma nova configuração

**Permissões:** Admin, Gestor

```bash
curl -X POST http://localhost:5231/api/automationconfig \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "Jira.Token",
    "value": "seu_token_jira",
    "description": "Jira API token",
    "isEncrypted": true
  }'
```

### **PUT /api/automationconfig/{key}**
Atualiza uma configuração existente

**Permissões:** Admin, Gestor

```bash
curl -X PUT http://localhost:5231/api/automationconfig/GitLab.Token \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "novo_token_gitlab",
    "description": "GitLab API token atualizado"
  }'
```

### **DELETE /api/automationconfig/{key}**
Remove uma configuração

**Permissões:** Admin, Gestor

```bash
curl -X DELETE http://localhost:5231/api/automationconfig/GitLab.Token \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🔑 Chaves Pré-Definidas

As seguintes chaves estão disponíveis como constantes em `AutomationConfig.Keys`:

| Chave | Descrição | Criptografado |
|-------|-----------|---------------|
| `GitHub.Token` | Token de API do GitHub | ✅ Sim |
| `GitLab.Token` | Token de API do GitLab | ✅ Sim |
| `GitLab.Url` | URL base do GitLab | ❌ Não |
| `GitLab.ProjectId` | ID do projeto GitLab | ❌ Não |
| `Jira.Url` | URL do Jira | ❌ Não |
| `Jira.Token` | Token de API do Jira | ✅ Sim |
| `Teams.WebhookUrl` | URL do webhook do Teams | ✅ Sim |

## 🔒 Segurança

### **Criptografia**
- Algoritmo: **AES-256**
- Valores marcados com `IsEncrypted = true` são automaticamente criptografados
- Tokens e senhas **SEMPRE** devem ser marcados como criptografados

### **Controle de Acesso**
- Apenas **Admin** e **Gestor** podem gerenciar configurações
- Valores criptografados nunca são retornados pela API (aparecem como `***ENCRYPTED***`)

### **Uso em Serviços**

Para usar as configurações em seus serviços:

```csharp
public class GitLabService
{
    private readonly IAutomationConfigService _configService;
    
    public GitLabService(IAutomationConfigService configService)
    {
        _configService = configService;
    }
    
    public async Task CreateIssueAsync(string title, string description)
    {
        // Obter token descriptografado
        var token = await _configService.GetDecryptedValueAsync("GitLab.Token");
        var projectId = await _configService.GetDecryptedValueAsync("GitLab.ProjectId");
        var url = await _configService.GetDecryptedValueAsync("GitLab.Url");
        
        // Usar token para chamar API do GitLab
        // ...
    }
}
```

## 📊 Dados Seed

O banco de dados vem com as seguintes configurações pré-criadas:

1. **GitHub.Token** = `""` (vazio, criptografado) - **Configure via API**
2. **GitLab.Url** = `https://gitlab.com` (não criptografado)
3. **GitLab.Token** = `""` (vazio, criptografado) - **Configure via API**
4. **GitLab.ProjectId** = `""` (vazio, não criptografado) - **Configure via API**

## 🔄 Migração de Dados

Se você já tem um banco de dados existente e quer adicionar a tabela de configurações:

```bash
cd backend/PRManager.API

# Deletar banco antigo
rm -f prmanager.db prmanager.db-shm prmanager.db-wal

# Rodar API para recriar com nova estrutura
dotnet run
```

Ou use migrations do EF Core (para produção):

```bash
dotnet ef migrations add AddAutomationConfig
dotnet ef database update
```

## 🧪 Testando

### **1. Listar Configurações:**
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5231/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"samuel.santos@company.com","password":"password123"}' \
  | jq -r '.token')

# Listar
curl -X GET http://localhost:5231/api/automationconfig \
  -H "Authorization: Bearer $TOKEN" | jq
```

### **2. Configurar Token GitLab:**
```bash
curl -X PUT http://localhost:5231/api/automationconfig/GitLab.Token \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "glpat-meu_token_secreto",
    "description": "GitLab token para criar issues"
  }' | jq
```

### **3. Verificar Criptografia:**
```bash
# Ver no banco (valor criptografado)
sqlite3 prmanager.db "SELECT * FROM AutomationConfigs WHERE Key = 'GitLab.Token';"

# Ver via API (aparece como ***ENCRYPTED***)
curl -X GET http://localhost:5231/api/automationconfig/GitLab.Token \
  -H "Authorization: Bearer $TOKEN" | jq
```

## ⚠️ Avisos Importantes

1. **Nunca commite tokens** no `appsettings.json`
2. **Use User Secrets** para desenvolvimento
3. **Use variáveis de ambiente** ou **Azure Key Vault** para produção
4. **Sempre marque tokens como criptografados** (`IsEncrypted = true`)
5. **Apenas Admin e Gestor** podem gerenciar configurações

## 🔧 Troubleshooting

### **Erro: "Unauthorized"**
- Verifique se você está logado como Admin ou Gestor
- Verifique se o token JWT está válido

### **Erro: "Key already exists"**
- Use `PUT` para atualizar ao invés de `POST` para criar

### **Valor descriptografado está errado**
- A chave de criptografia mudou
- Reconfigure o valor usando `PUT`

---

**Pronto!** Agora você tem um sistema completo para gerenciar tokens e configurações de automação de forma segura! 🎉
