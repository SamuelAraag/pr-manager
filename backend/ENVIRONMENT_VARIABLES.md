# Variáveis de Ambiente - PR Manager Backend

## 📁 Arquivos de Configuração

O projeto .NET usa arquivos JSON para configuração ao invés de arquivos `.env` tradicionais:

### **Arquivos Principais:**

1. **`appsettings.json`** - Configurações gerais (produção)
2. **`appsettings.Development.json`** - Configurações de desenvolvimento (sobrescreve o primeiro)

**Localização:**
```
/Users/samuelaraag/Downloads/documentos/projetos/pr-manager/backend/PRManager.API/
```

## 🔐 Configurações Atuais

### **Connection String (Banco de Dados)**
```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=prmanager.db"
}
```

### **JWT Settings (Autenticação)**
```json
"JwtSettings": {
  "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
  "Issuer": "PRManagerAPI",
  "Audience": "PRManagerFrontend"
}
```

## ⚙️ Como Funciona

O .NET carrega as configurações nesta ordem:

1. **`appsettings.json`** (base)
2. **`appsettings.{Environment}.json`** (sobrescreve)
3. **Variáveis de ambiente do sistema** (sobrescreve tudo)
4. **User Secrets** (desenvolvimento)

O ambiente é definido pela variável `ASPNETCORE_ENVIRONMENT`:
- `Development` → usa `appsettings.Development.json`
- `Production` → usa `appsettings.Production.json`
- `Staging` → usa `appsettings.Staging.json`

## 🔒 Segurança - User Secrets (Recomendado)

Para **dados sensíveis** (senhas, tokens, API keys), use **User Secrets** ao invés de colocar no `appsettings.json`:

### **Configurar User Secrets:**

```bash
cd /Users/samuelaraag/Downloads/documentos/projetos/pr-manager/backend/PRManager.API

# Inicializar User Secrets
dotnet user-secrets init

# Adicionar secrets
dotnet user-secrets set "JwtSettings:SecretKey" "MinhaChaveSuperSecreta123!"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Data Source=prmanager.db"

# Listar secrets
dotnet user-secrets list

# Remover um secret
dotnet user-secrets remove "JwtSettings:SecretKey"

# Limpar todos
dotnet user-secrets clear
```

**Vantagens:**
- ✅ Não fica no código fonte
- ✅ Não vai para o Git
- ✅ Específico para cada desenvolvedor
- ✅ Armazenado fora do projeto

**Localização dos User Secrets no Mac:**
```
~/.microsoft/usersecrets/{user-secrets-id}/secrets.json
```

## 🌍 Variáveis de Ambiente do Sistema

Você também pode usar variáveis de ambiente tradicionais:

### **No Terminal (temporário):**
```bash
export ASPNETCORE_ENVIRONMENT=Development
export ConnectionStrings__DefaultConnection="Data Source=prmanager.db"
export JwtSettings__SecretKey="MinhaChave123"

dotnet run
```

### **No `.zshrc` ou `.bashrc` (permanente):**
```bash
# Adicionar ao ~/.zshrc
export ASPNETCORE_ENVIRONMENT=Development
export ConnectionStrings__DefaultConnection="Data Source=prmanager.db"
```

**Nota:** Use `__` (dois underscores) para separar níveis hierárquicos no JSON.

## 📝 Criar Arquivo `.env` (Opcional)

Se você preferir usar um arquivo `.env` tradicional, pode criar um e carregar com uma biblioteca:

### **1. Instalar pacote:**
```bash
dotnet add package DotNetEnv
```

### **2. Criar `.env`:**
```bash
# /Users/samuelaraag/Downloads/documentos/projetos/pr-manager/backend/PRManager.API/.env
ASPNETCORE_ENVIRONMENT=Development
DATABASE_PATH=prmanager.db
JWT_SECRET=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
JWT_ISSUER=PRManagerAPI
JWT_AUDIENCE=PRManagerFrontend
```

### **3. Carregar no `Program.cs`:**
```csharp
using DotNetEnv;

// No início do Program.cs
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Usar variáveis
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET");
```

### **4. Adicionar ao `.gitignore`:**
```bash
echo ".env" >> .gitignore
```

## 🚀 Produção (Docker/Azure/AWS)

### **Docker:**
```dockerfile
# Dockerfile
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ConnectionStrings__DefaultConnection="Server=db;Database=prmanager"
```

### **docker-compose.yml:**
```yaml
environment:
  - ASPNETCORE_ENVIRONMENT=Production
  - ConnectionStrings__DefaultConnection=Server=db;Database=prmanager
  - JwtSettings__SecretKey=${JWT_SECRET}
```

### **Azure App Service:**
- Configurar em: **Configuration → Application Settings**

### **AWS Elastic Beanstalk:**
- Configurar em: **Environment Properties**

## 📋 Checklist de Segurança

- [ ] **Nunca** commitar `appsettings.Production.json` com dados sensíveis
- [ ] Usar **User Secrets** para desenvolvimento
- [ ] Usar **variáveis de ambiente** em produção
- [ ] Adicionar `appsettings.*.json` (exceto Development) no `.gitignore`
- [ ] Rotacionar chaves JWT periodicamente
- [ ] Usar HTTPS em produção

## 🔍 Acessar Configurações no Código

```csharp
// No construtor de um serviço ou controller
private readonly IConfiguration _configuration;

public MyService(IConfiguration configuration)
{
    _configuration = configuration;
}

// Acessar valores
var jwtSecret = _configuration["JwtSettings:SecretKey"];
var connectionString = _configuration.GetConnectionString("DefaultConnection");

// Bind para objeto
var jwtSettings = _configuration.GetSection("JwtSettings").Get<JwtSettings>();
```

## 📦 Arquivo `.gitignore` Recomendado

```gitignore
# Arquivos de configuração sensíveis
appsettings.Production.json
appsettings.Staging.json
*.user
*.env

# Banco de dados
*.db
*.db-shm
*.db-wal

# Build
bin/
obj/
```

---

**Resumo:**
- ✅ Use `appsettings.json` para configurações gerais
- ✅ Use `appsettings.Development.json` para desenvolvimento
- ✅ Use **User Secrets** para dados sensíveis locais
- ✅ Use **variáveis de ambiente** em produção
