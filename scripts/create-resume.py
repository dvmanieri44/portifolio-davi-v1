"""Generate the one-page English resume from the same content as the HTML version.

Run npm run generate first. Requires reportlab and pypdf.
"""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / 'tmp/resume-content.json').read_text(encoding='utf-8'))
target = ROOT / 'output/pdf/davi-manieri-resume-en.pdf'
target.parent.mkdir(parents=True, exist_ok=True)
navy = colors.HexColor('#0c1c38')
blue = colors.HexColor('#315789')
styles = {
    'name': ParagraphStyle('Name', fontName='Helvetica-Bold', fontSize=23, leading=26, textColor=navy, spaceAfter=5),
    'title': ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=blue, spaceAfter=4),
    'body': ParagraphStyle('Body', fontName='Helvetica', fontSize=10, leading=13.6, textColor=navy, spaceAfter=4),
    'small': ParagraphStyle('Small', fontName='Helvetica', fontSize=9.1, leading=12, textColor=navy, spaceAfter=4),
    'section': ParagraphStyle('Section', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=blue, spaceBefore=10, spaceAfter=5),
    'job': ParagraphStyle('Job', fontName='Helvetica-Bold', fontSize=10.4, leading=14, textColor=navy, spaceAfter=2),
    'bullet': ParagraphStyle('Bullet', fontName='Helvetica', fontSize=10, leading=13.6, textColor=navy, leftIndent=9, firstLineIndent=-7, spaceAfter=3),
}
story = []
def p(text, style='body'):
    return Paragraph(text, styles[style])
def link(label, url):
    return f'<link href="{escape(url)}" color="#315789"><u>{escape(label)}</u></link>'
def section(title):
    story.append(p(title.upper(), 'section'))

story += [p(escape(data['name']), 'name'), p(escape(data['title']), 'title'), p(escape(data['location']), 'small')]
story.append(p(link(data['email'], 'mailto:' + data['email']) + ' | ' + ' | '.join(link(*item) for item in data['links']), 'small'))
story.append(Spacer(1, 5))
story.append(p(escape(data['summary'])))
section('Experience')
for job in data['experience']:
    story.append(KeepTogether([p(f"{escape(job['company'])} | {escape(job['dates'])}", 'job'), p(escape(job['role']), 'small')]))
    story.extend(p('- ' + escape(bullet), 'bullet') for bullet in job['bullets'])
section('Backend & applied AI')
story.append(p(escape(data['ai'])))
section('Selected projects')
for name, description, url in data['projects']:
    story.append(p(f'<b>{link(name, url)}</b> - {escape(description)}'))
section('Skills')
story.append(p(escape(data['skills'])))
section('Education & languages')
story.extend(p(escape(item)) for item in data['education'])
doc = SimpleDocTemplate(str(target), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=34, bottomMargin=30,
    title='Davi Ponce Manieri - Software Engineer', author='Davi Ponce Manieri', subject='English professional resume')
doc.build(story)
reader = PdfReader(str(target))
assert len(reader.pages) == 1, f'Expected one page, got {len(reader.pages)}'
text = reader.pages[0].extract_text()
for expected in ['Davi Ponce Manieri', 'Clareza', 'B1', 'Programador III', '2024 - 2025']:
    assert expected in text, f'Missing: {expected}'
assert len(reader.pages[0].get('/Annots', [])) >= 7, 'Missing active contact/project links'
print(f'Resume generated and verified: {target} ({target.stat().st_size} bytes)')
