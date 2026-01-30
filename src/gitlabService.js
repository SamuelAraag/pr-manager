export const GitLabService = {
    async createIssue(token, data) {
        const url = 'https://gitlab.com/api/v4/projects/69884004/issues';
        
        const description = `
## Sistema/Módulo Envolvido:

 ${data.modulo} 

## Ambiente de Implantação:

- [x] Staging
- [ ] Produção
- [ ] Outro (especificar):

## Link do pipeline executado com a geração da versão:

 ${data.pipeline_url}

## Versão da Aplicação/Serviço:

${data.versao}

## Urgência:

- [ ] Baixa
- [x] Média
- [ ] Alta
- [ ] Crítica (Hotfix - descrever justificativa no campo abaixo)

## Objetivo do Deploy:

Testes da implementação pelo time de QA.

## Plano de Rollback/Reversão:

${data.rollback || 'Não temos uma versão de rollback.'}

## Pontos de Atenção na Reversão:

<!--Há algum risco específico ou impacto na reversão?-->

## Observações:

<!--Qualquer informação extra que possa ser útil para a equipe de Tecnologia.-->

__________________________________________________
`.trim();

        const body = {
            title: `Gerar versão - ${data.modulo}`,
            description: description,
            labels: ["status::Triagem", "Tipo::Deploy"]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'PRIVATE-TOKEN': token
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message?.[0] || response.statusText);
            }

            return await response.json();
        } catch (error) {
            console.error('GitLab API Error:', error);
            throw error;
        }
    }
};
