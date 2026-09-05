# Davi Manieri — Portfolio

Portfolio profissional bilíngue com foco em vagas internacionais de desenvolvimento Android.

## Conteúdo

- Projetos públicos reais e links diretos para os repositórios
- Experiência profissional
- Formação, competências e certificados
- Currículo, LinkedIn, GitHub e contato
- Fallback estático para evitar uma página vazia quando serviços externos estiverem indisponíveis

## Desenvolvimento

```bash
npm install
npm run build
```

O build transforma os arquivos JSX em JavaScript pronto para produção dentro de `js/build/`. Para testar a integração com o Firebase, sirva a pasta por HTTP com um servidor local; abrir `index.html` diretamente também exibe o conteúdo principal, usando os dados locais.

## Publicação

O site é compatível com hospedagem estática, incluindo GitHub Pages. Sempre execute `npm run build` antes de publicar mudanças em `app.jsx` ou `sections.jsx`.
