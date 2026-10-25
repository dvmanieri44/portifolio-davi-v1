// Arquivos públicos usados tanto pelo build quanto pelo servidor local.
export const publicAssets = new Map([
  ['index.html', 'text/html; charset=utf-8'],
  ['styles.css', 'text/css; charset=utf-8'],
  ['js/main.js', 'text/javascript; charset=utf-8'],
  ['img/davi-manieri.jpg', 'image/jpeg'],
  ['img/davi-portrait-480.webp', 'image/webp'],
  ['img/davi-portrait-960.webp', 'image/webp'],
  ['img/social-card.jpg', 'image/jpeg'],
  ['img/favicon.svg', 'image/svg+xml'],
  ['sitemap.xml', 'application/xml; charset=utf-8'],
  ['output/pdf/davi-manieri-resume-en.pdf', 'application/pdf'],
  ['en/resume/index.html', 'text/html; charset=utf-8'],
]);

for (const prefix of ['', 'en/', 'es/']) {
  publicAssets.set(`${prefix}index.html`, 'text/html; charset=utf-8');
  for (const project of ['clareza', 'lectio', 'erp']) {
    publicAssets.set(`${prefix}projects/${project}/index.html`, 'text/html; charset=utf-8');
  }
}
