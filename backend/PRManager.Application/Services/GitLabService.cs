using System.Text;
using System.Text.Json;
using PRManager.Application.DTOs;
using PRManager.Application.Interfaces;

namespace PRManager.Application.Services;

public class GitLabService : IGitLabService
{
    private readonly IAutomationConfigService _configService;
    private readonly HttpClient _httpClient;
    private readonly IVersionBatchService _versionBatchService;
    private const string GitLabApiUrl = "https://gitlab.com/api/v4/projects/69884004/issues";

    public GitLabService(IAutomationConfigService configService, HttpClient httpClient, IVersionBatchService versionBatchService)
    {
        _configService = configService;
        _httpClient = httpClient;
        _versionBatchService = versionBatchService;
    }

    public async Task<string> CreateIssueAsync(string batchId)
    {
        var config = await _configService.GetConfigAsync();
        
        if (string.IsNullOrEmpty(config.GitlabToken))
        {
            throw new Exception("GitLab Token não configurado.");
        }

        var batch = await _versionBatchService.GetByBatchIdAsync(batchId)
            ?? throw new Exception($"Lote de versão não encontrado para o ID: {batchId}");

        var summary = batch.PullRequests.Select(x => $"- {x.Summary}").ToList();
        var summaryMix = string.Join(Environment.NewLine, summary);

//Nao mudar a indentacao abaixo.
        var description = $@"
## Sistema/Módulo Envolvido:

{batch.Project} 

## Ambiente de Implantação:

- [x] Staging
- [ ] Produção
- [ ] Outro (especificar):

## Link do pipeline executado com a geração da versão:

{batch.PipelineLink}

## Versão da Aplicação/Serviço:

{batch.Version}

## Urgência:

- [ ] Baixa
- [x] Média
- [ ] Alta
- [ ] Crítica (Hotfix - descrever justificativa no campo abaixo)

## Objetivo do Deploy:

Testes da implementação pelo time de QA.

{summaryMix}

## Plano de Rollback/Reversão:

{(!string.IsNullOrEmpty(batch.Rollback) ? batch.Rollback : "Não temos uma versão de rollback.")}

## Pontos de Atenção na Reversão:

<!--Há algum risco específico ou impacto na reversão?-->

## Observações:

<!--Qualquer informação extra que possa ser útil para a equipe de Tecnologia.-->

__________________________________________________
".Trim();

        var body = new
        {
            title = $"Gerar versão - {batch.Project}",
            description = description,
            labels = new[] { "status::Triagem", "Tipo::Deploy" }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, GitLabApiUrl);
        request.Headers.Add("PRIVATE-TOKEN", config.GitlabToken);
        request.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Erro ao criar chamado no GitLab: {response.StatusCode} - {errorContent}");
        }

        var result = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(result);
        var webUrl = doc.RootElement.GetProperty("web_url").GetString() ?? "";

        if (!string.IsNullOrEmpty(webUrl))
        {
            await _versionBatchService.UpdateByBatchIdAsync(batchId, new UpdateVersionBatchDto 
            { 
                GitlabIssueLink = webUrl
            });
        }

        return webUrl;
    }
}
