# PR Manager - Backend (.NET 9)

API REST completa para gerenciamento de Pull Requests com autenticação JWT e controle de acesso baseado em roles.

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas (Clean Architecture):

```
backend/
├── PRManager.API/              # Camada de apresentação (Controllers, Program.cs)
├── PRManager.Application/      # Lógica de aplicação (Services, DTOs)
├── PRManager.Domain/           # Modelos de domínio (Entities, Enums)
└── PRManager.Infrastructure/   # Acesso a dados (EF Core, DbContext)
```

## 🚀 Como Executar

### Pré-requisitos

- .NET 9 SDK instalado
- SQLite (incluído no projeto)

### Passos

1. **Navegar para o diretório do backend**:
   ```bash
   cd backend
   ```

2. **Restaurar dependências**:
   ```bash
   dotnet restore
   ```

3. **Executar a API**:
   ```bash
   cd PRManager.API
   dotnet run
   ```

4. **Acessar o Swagger**:
   - Abra o navegador em: `http://localhost:5000/swagger`
   - Documentação interativa da API

## 📡 Endpoints da API

### Autenticação

- `POST /api/auth/login` - Login de usuário

### Pull Requests

- `GET /api/pullrequests` - Listar todos os PRs
- `GET /api/pullrequests/{id}` - Obter PR específico
- `POST /api/pullrequests` - Criar novo PR
- `PUT /api/pullrequests/{id}` - Atualizar PR
- `DELETE /api/pullrequests/{id}` - Deletar PR
- `POST /api/pullrequests/{id}/approve` - Aprovar PR (QA/Gestor)
- `POST /api/pullrequests/{id}/request-correction` - Solicitar correção (QA/Gestor)
- `POST /api/pullrequests/{id}/request-version` - Solicitar versão (QA)
- `POST /api/pullrequests/{id}/deploy-staging` - Deploy em staging (QA)
- `POST /api/pullrequests/{id}/mark-done` - Marcar como concluído (QA)

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

### Como autenticar:

1. Faça login via `POST /api/auth/login`:
   ```json
   {
     "email": "rodrigo.barbosa@company.com",
     "password": "password123"
   }
   ```

2. Receba o token JWT na resposta:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": 1,
       "name": "Rodrigo Barbosa",
       "email": "rodrigo.barbosa@company.com",
       "role": "Dev"
     }
   }
   ```

3. Use o token em requisições subsequentes:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

## 👥 Usuários Padrão

O banco de dados vem com usuários pré-cadastrados (senha: `password123`):

| Nome              | Email                           | Role    |
|-------------------|---------------------------------|---------|
| Rodrigo Barbosa   | rodrigo.barbosa@company.com     | Dev     |
| Itallo Cerqueira  | itallo.cerqueira@company.com    | Dev     |
| Marcos Paulo      | marcos.paulo@company.com        | Dev     |
| Samuel Santos     | samuel.santos@company.com       | Gestor  |
| Kemilly Alvez     | kemilly.alvez@company.com       | QA      |

## 🔑 Roles e Permissões

### Dev
- Criar, editar e deletar próprios PRs
- Visualizar todos os PRs

### QA
- Todas as permissões de Dev
- Aprovar PRs
- Solicitar correções
- Solicitar versões
- Deploy em staging
- Marcar PRs como concluídos

### Gestor
- Todas as permissões de QA
- Aprovar PRs de qualquer desenvolvedor

### Admin
- Todas as permissões
- Gerenciar usuários

## 🗄️ Banco de Dados

- **SQLite** para desenvolvimento (arquivo `prmanager.db`)
- Fácil migração para **PostgreSQL** ou **SQL Server** para produção
- Entity Framework Core para ORM

### Estrutura de Tabelas

- **Users** - Usuários do sistema
- **PullRequests** - Pull Requests
- **Sprints** - Sprints de desenvolvimento

## ⚙️ Configuração

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=prmanager.db"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "PRManagerAPI",
    "Audience": "PRManagerFrontend"
  }
}
```

### CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:5500`
- `http://127.0.0.1:5500`
- `http://localhost:3000`

Para adicionar mais origens, edite `Program.cs`:

```csharp
policy.WithOrigins(
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "https://seu-dominio.com"  // Adicione aqui
)
```

## 📦 Pacotes NuGet Utilizados

- **Microsoft.EntityFrameworkCore.Sqlite** (9.0.1) - ORM e banco de dados
- **Microsoft.AspNetCore.Authentication.JwtBearer** (9.0.1) - Autenticação JWT
- **Swashbuckle.AspNetCore** (7.2.0) - Documentação Swagger
- **BCrypt.Net-Next** (4.0.3) - Hash de senhas
- **System.IdentityModel.Tokens.Jwt** (8.15.0) - Geração de tokens JWT

## 🧪 Testando a API

### Usando Swagger

1. Execute a API: `dotnet run`
2. Abra `http://localhost:5000/swagger`
3. Clique em "Authorize" e insira o token JWT
4. Teste os endpoints diretamente no navegador

### Usando cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rodrigo.barbosa@company.com","password":"password123"}'

# Listar PRs (com token)
curl -X GET http://localhost:5000/api/pullrequests \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Criar PR
curl -X POST http://localhost:5000/api/pullrequests \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "project": "DF-e",
    "summary": "Correção de bug",
    "devName": "Rodrigo Barbosa",
    "prLink": "https://bitbucket.org/...",
    "taskLink": "https://jira.com/...",
    "teamsLink": "https://teams.microsoft.com/..."
  }'
```

## 🔄 Próximos Passos

- [ ] Integração com GitHub API
- [ ] Integração com GitLab API
- [ ] Webhooks para sincronização automática
- [ ] Testes unitários e de integração
- [ ] Deploy em produção (Docker + PostgreSQL)

## 📝 Licença

Uso interno da equipe de desenvolvimento.
