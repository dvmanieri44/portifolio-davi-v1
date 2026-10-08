# Davi Manieri — Portfólio

Site estático em HTML, CSS e JavaScript. Reúne três projetos, experiência profissional, graduação, curso técnico, Inglês na inFlux e contatos, em um layout responsivo azul escuro e branco.

## Desenvolvimento

Requer Node.js 20 ou superior. O projeto usa apenas recursos nativos do Node e do navegador; não é necessário instalar dependências.

```bash
npm run dev
```

Abra [http://127.0.0.1:4173](http://127.0.0.1:4173). Recarregue o navegador após editar os arquivos e encerre o servidor com `Ctrl+C`.

Para usar outra porta no PowerShell:

```powershell
$env:PORT = "4180"
npm run dev
```

Também é possível abrir `index.html` diretamente. A cópia de e-mail depende da disponibilidade da API de clipboard no navegador.

## Estrutura

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Conteúdo, contatos, links, metadados e marcação acessível. |
| `styles.css` | Cores, tipografia, layout responsivo e ilustrações dos projetos. |
| `js/main.js` | Movimento do retrato, cópia de e-mail e atualização do ano. |
| `img/favicon.svg` | Monograma “dm.” para a aba do navegador. |
| `img/davi-manieri.jpg` | Foto original, imagem social e ícone de atalho. |
| `img/davi-portrait.png` | Retrato com fundo transparente e camisa azul. |
| `scripts/assets.mjs` | Lista única de arquivos públicos e seus tipos de conteúdo. |
| `scripts/serve.mjs` | Servidor local de desenvolvimento e prévia. |
| `scripts/build-site.mjs` | Geração de `dist/client` e do adaptador de hospedagem. |
| `.openai/hosting.json` | Identificação da hospedagem existente. |

O conteúdo funciona sem JavaScript. O site não usa frameworks, fontes externas, banco de dados ou APIs. Firebase aparece apenas no texto sobre a experiência profissional; não há integração com o serviço.

A origem do retrato e os prompts de edição estão em [docs/portrait.md](docs/portrait.md).

## Atualizar o conteúdo

Edite nome, empresa, projetos, experiência, formação e contatos em `index.html`. Ao alterar contatos, atualize o texto visível e os respectivos `href`. O botão de copiar lê o endereço exibido no link de e-mail.

As cores, fontes e margens ficam nas variáveis no início de `styles.css`. Os ajustes responsivos ficam no final do arquivo. Os textos descritivos têm pelo menos 18 px e os projetos usam ilustrações em CSS e SVG.

O retrato principal usa `img/davi-portrait.png`; seu histórico de edição está em `docs/portrait.md`. Ao substituir uma imagem por outra com dimensões diferentes, ajuste também os atributos `width` e `height` no HTML. O favicon usa `img/favicon.svg`.

Ao adicionar ou remover um arquivo público, atualize `scripts/assets.mjs` e as referências no HTML ou CSS. O build e o servidor local usam essa mesma lista. Documentação, configurações locais e scripts de manutenção não são publicados.

Os projetos selecionados são [Lectio Divina](https://github.com/dvmanieri44/lectio-divina), [PremieRpet ERP](https://github.com/dvmanieri44/erp-de-controle-de-estoque) e [Dopamine Free Launcher](https://github.com/dvmanieri44/DopamineFreeLauncher).

## Build e publicação

```bash
npm run build
npm run preview
```

O build recria `dist/` a partir dos arquivos listados em `scripts/assets.mjs`. Nunca edite `dist/` manualmente: altere os arquivos de origem e execute o build novamente.

`npm run preview` serve `dist/client` na porta 4173 e também aceita a variável `PORT`. Encerre o servidor de desenvolvimento antes de iniciar a prévia na mesma porta.

Publique o conteúdo de `dist/client` em uma hospedagem estática. Os caminhos relativos também permitem servir o site em uma subpasta, como no GitHub Pages. `dist/server/index.js` mantém o adaptador de assets usado pela hospedagem existente. Executar o build não publica o site.

## Verificação manual

- Executar `npm run build` e verificar o resultado com `npm run preview`.
- Conferir o layout em celular, tablet e desktop, sem rolagem horizontal.
- Navegar por teclado e verificar os focos visíveis e o link para pular ao conteúdo.
- Conferir os três repositórios, os contatos e as âncoras de navegação.
- Testar a cópia de e-mail e o feedback quando o navegador negar acesso.
- Confirmar que o conteúdo permanece visível sem JavaScript.
- Verificar a preferência de movimento reduzido, que desativa rolagem suave, transições e a inclinação interativa do retrato.
