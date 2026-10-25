# Davi Manieri — portfólio

Site estático em português, inglês e espanhol. Apresenta Davi como Software Engineer com especialização Android, experiência full-stack e integração de IA em produção.

## Desenvolvimento

Requisito: Node.js 20+ (CI em Node.js 24).

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run check
npm.cmd run preview
```

Desenvolvimento e prévia usam `http://127.0.0.1:4173`. `PORT` permite mudar a porta. `npm run check` exige um build atualizado e verifica páginas, links internos, âncoras, metadados, respostas HTTP e cópia de e-mail nos três idiomas.

## Onde editar

- `scripts/content.mjs`: textos PT/EN/ES, projetos e estudos de caso.
- `scripts/resume-content.mjs`: conteúdo do currículo em inglês.
- `scripts/generate-pages.mjs`: templates compartilhados e geração das páginas.
- `styles.css`: identidade visual e responsividade.
- `js/main.js`: ano e melhoria opcional de cópia de e-mail.
- `scripts/assets.mjs`: lista explícita dos arquivos publicados.

Execute `npm run generate` após editar o conteúdo. Não edite manualmente `index.html`, `en/`, `es/`, `projects/` ou `sitemap.xml`: são arquivos gerados e versionados para manter compatibilidade com hospedagem estática pela raiz do repositório. O build também os atualiza antes de copiar para `dist/client`.

## Idiomas e navegação

Português fica na raiz, inglês em `/en/` e espanhol em `/es/`. Cada idioma tem HTML completo, metadados, canonical e links hreflang. A escolha de idioma é expressa na URL, sem redirecionamento automático ou dependência de localStorage. Links de idioma nos estudos de caso levam ao mesmo projeto traduzido. Todo conteúdo e navegação funcionam sem JavaScript.

Os projetos principais são Clareza e Lectio Divina. ERP e Dopamine Free Launcher aparecem em uma lista secundária. Há estudos de caso de Clareza, Lectio e ERP nos três idiomas. O currículo está em `/en/resume/` e em `output/pdf/davi-manieri-resume-en.pdf`.

## Currículo e imagens

O PDF e as imagens otimizadas são versionados; o build normal não exige Python. Para atualizar o currículo, execute primeiro `npm run generate`, depois `python scripts/create-resume.py` em um ambiente com `reportlab` e `pypdf`. Renderize e confira o PDF após mudar seu conteúdo. O script exige uma página e valida texto e links.

`python scripts/optimize-images.py` exige Pillow e usa as fontes Segoe UI do Windows. Gera WebP em 480/960 px e um cartão social a partir da foto original, preservada em `img/davi-portrait.png`. A foto original não entra no artefato de publicação. Não há capturas fictícias de aplicativos: as capas dos projetos são ilustrações decorativas.

## Publicação

O endereço canônico é definido em `scripts/content.mjs`. Publique o conteúdo de `dist/client` no GitHub Pages ou em outra hospedagem estática. Os caminhos relativos suportam a subpasta `portifolio-davi-v1`. O sitemap fica em `/portifolio-davi-v1/sitemap.xml`; em GitHub Pages de projeto, um robots.txt nessa subpasta não controla o domínio.

`dist/server/index.js` preserva o adaptador da hospedagem existente. A workflow `Verify portfolio` verifica build e integridade, mas não publica o site. Executar build local também não publica.

## Conteúdo e evidências

A narrativa profissional usa o briefing fornecido pelo autor e os READMEs públicos. São mantidos os anos das duas experiências Tecnomotor; meses, datas da formação e histórico freelance não confirmados foram omitidos. IA em produção é diferenciada de estudos de RAG/LLMs. Coordenação no ERP não é apresentada como cargo formal de gestão. Os exemplos profissionais não identificam sistemas internos, protocolos ou código privado.

A aplicação Clareza é um link fornecido pelo autor; a operação do Firebase e a disponibilidade dos sites externos não fazem parte do teste local. Os estudos de caso descrevem implementação e validação documentadas, sem inventar métricas de uso ou desempenho.

## Revisão visual e acessibilidade

A implementação inclui semântica, foco visível, link para pular conteúdo, idioma por página, links externos identificados, respeito a movimento reduzido e controles de idioma com 44 px. Os testes estáticos não substituem leitor de tela nem inspeção visual.

Antes de publicar, conferir em navegador: 320/390/768/1440 px, zoom de 200% e 400%, ausência de rolagem horizontal, teclado, leitor de tela, cópia de e-mail e leitura nos três idiomas. Medir LCP/CLS/INP com ferramentas de navegador. Capturas reais e vídeos dos aplicativos dependem de execução e captura das aplicações; não foram substituídos por mockups.
