const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// Helper to escape HTML
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Markdown parser customized for the SOP format
function markdownToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let inCode = false;
  let codeLang = '';
  let codeBuffer = [];
  let inTable = false;
  let inList = false;
  let listType = 'ul';

  function closeList() {
    if (inList) {
      out.push(`</${listType}>`);
      inList = false;
    }
  }

  function closeTable() {
    if (inTable) {
      out.push('</tbody></table></div>');
      inTable = false;
    }
  }

  function parseInline(text) {
    let t = escapeHtml(text);
    // Inline code
    t = t.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Bold
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic
    t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Checkboxes
    t = t.replace(/\[x\]/gi, '<span class="cb checked">&#9745;</span>');
    t = t.replace(/\[ \]/g, '<span class="cb">&#9744;</span>');
    t = t.replace(/☑/g, '<span class="cb checked">&#9745;</span>');
    t = t.replace(/☐/g, '<span class="cb">&#9744;</span>');
    // Links
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="doc-link">$1</span>');
    return t;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Code blocks
    if (line.startsWith('```')) {
      closeList();
      closeTable();
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeBuffer = [];
      } else {
        inCode = false;
        out.push(`<div class="code-wrapper"><div class="code-tag">${escapeHtml(codeLang || 'code')}</div><pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre></div>`);
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Tables
    if (line.startsWith('|') && line.endsWith('|')) {
      closeList();
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        out.push('<div class="table-wrap"><table class="sop-table"><thead><tr>');
        out.push(cells.map(c => `<th>${parseInline(c)}</th>`).join(''));
        out.push('</tr></thead><tbody>');
      } else {
        out.push('<tr>' + cells.map(c => `<td>${parseInline(c)}</td>`).join('') + '</tr>');
      }
      continue;
    } else {
      closeTable();
    }

    // Dividers
    if (/^---{1,}$/.test(line)) {
      closeList();
      out.push('<hr class="divider" />');
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      closeList();
      out.push(`<h1 class="h1-serif">${parseInline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      out.push(`<h2 class="h2-serif">${parseInline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      out.push(`<h3 class="h3-sans">${parseInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      closeList();
      out.push(`<h4 class="h4-sans">${parseInline(line.slice(5))}</h4>`);
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      closeList();
      out.push(`<blockquote class="sop-quote">${parseInline(line.replace(/^>\s*/, ''))}</blockquote>`);
      continue;
    }

    // Unordered Lists
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
        out.push('<ul class="sop-list">');
      }
      out.push(`<li>${parseInline(bulletMatch[1])}</li>`);
      continue;
    }

    // Numbered Lists
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (!inList || listType !== 'ol') {
        closeList();
        inList = true;
        listType = 'ol';
        out.push('<ol class="sop-list">');
      }
      out.push(`<li>${parseInline(numMatch[2])}</li>`);
      continue;
    }

    closeList();

    if (!line) continue;

    out.push(`<p class="sop-p">${parseInline(line)}</p>`);
  }

  closeList();
  closeTable();

  return out.join('\n');
}

// 12 Ordered Sections matching Notify exactly
const docSections = [
  { id: '1', name: '1. CLAUDE.md', file: path.join(rootDir, 'CLAUDE.md') },
  { id: '2', name: '2. prd.md — What are we building and why?', file: path.join(rootDir, 'docs', 'prd.md') },
  { id: '3', name: '3. architecture.md — How is it built and where does each piece live?', file: path.join(rootDir, 'docs', 'architecture.md') },
  { id: '4', name: '4. rules.md — What must every line of code follow?', file: path.join(rootDir, 'docs', 'rules.md') },
  { id: '5', name: '5. design.md — How does it look, and which tokens and components are used?', file: path.join(rootDir, 'docs', 'design.md') },
  { id: '6', name: '6. performance.md — How fast must it be, and what keeps it fast?', file: path.join(rootDir, 'docs', 'performance.md') },
  { id: '7', name: '7. ai-setup-guide.md — How does the AI stay grounded, secure, cheap and tested?', file: path.join(rootDir, 'docs', 'ai-setup-guide.md') },
  { id: '8', name: '8. task.md — What is the technical plan for each task?', file: path.join(rootDir, 'docs', 'task.md') },
  { id: '9', name: '9. memory.md — What have we decided and learned?', file: path.join(rootDir, 'docs', 'memory.md') },
  { id: '10', name: '10. Appendix — .env.example', file: path.join(rootDir, '.env.example') },
  { id: '11', name: '11. Appendix — Brand Guidelines', file: path.join(rootDir, 'docs', 'BRAND_GUIDELINES.md') },
  { id: '12', name: '12. Appendix — Blog Publishing API Specification', file: path.join(rootDir, 'docs', 'BLOG_INTEGRATION_SPEC.md') }
];

let bodyContent = '';

for (const sec of docSections) {
  if (fs.existsSync(sec.file)) {
    const raw = fs.readFileSync(sec.file, 'utf8');
    bodyContent += `
      <div class="sop-chapter" id="chapter-${sec.id}">
        ${markdownToHtml(raw)}
      </div>
    `;
  }
}

const htmlDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Mommantum — Development Docs (SOP)</title>
  <style>
    @page {
      size: A4;
      margin: 22mm 16mm 22mm 16mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.5;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Cover / Overview header matching Notify exactly */
    .cover-title {
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 27pt;
      font-weight: 400;
      color: #111827;
      margin: 0 0 6px 0;
      letter-spacing: -0.3px;
    }

    .cover-meta {
      font-size: 9pt;
      color: #6b7280;
      margin-bottom: 22px;
    }

    .cover-overview-heading {
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 14.5pt;
      font-weight: 400;
      color: #111827;
      margin: 18px 0 8px 0;
    }

    .cover-overview-text {
      font-size: 9.5pt;
      color: #374151;
      line-height: 1.55;
      margin-bottom: 18px;
    }

    /* Headings */
    h1.h1-serif {
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 17pt;
      font-weight: 400;
      color: #111827;
      margin: 28px 0 12px 0;
      padding-bottom: 4px;
      page-break-after: avoid;
    }

    h2.h2-serif {
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 12.5pt;
      font-weight: 400;
      color: #111827;
      margin: 20px 0 8px 0;
      page-break-after: avoid;
    }

    h3.h3-sans {
      font-size: 10.5pt;
      font-weight: 600;
      color: #111827;
      margin: 16px 0 6px 0;
      page-break-after: avoid;
    }

    h4.h4-sans {
      font-size: 9.5pt;
      font-weight: 600;
      color: #374151;
      margin: 12px 0 4px 0;
      page-break-after: avoid;
    }

    .sop-p {
      margin: 0 0 9px 0;
      color: #1f2937;
      text-align: left;
    }

    /* Tables matching Notify beige header and subtle border */
    .table-wrap {
      width: 100%;
      margin: 12px 0 16px 0;
      page-break-inside: auto;
    }

    table.sop-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      line-height: 1.4;
      background: #ffffff;
      border: 1px solid #e5e2da;
    }

    table.sop-table th {
      background: #f6f4ee;
      color: #111827;
      font-weight: 600;
      text-align: left;
      padding: 7px 9px;
      border: 1px solid #e5e2da;
      font-size: 8.5pt;
    }

    table.sop-table td {
      padding: 6px 9px;
      border: 1px solid #eeebe3;
      vertical-align: top;
      color: #374151;
    }

    table.sop-table tr:nth-child(even) td {
      background: #faf9f6;
    }

    /* Code blocks */
    .code-wrapper {
      position: relative;
      background: #f8fafc;
      border-radius: 4px;
      margin: 10px 0 14px 0;
      border: 1px solid #e2e8f0;
      page-break-inside: avoid;
    }

    .code-tag {
      display: none;
    }

    pre {
      margin: 0;
      padding: 10px 12px;
      overflow-x: auto;
      font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 8pt;
      line-height: 1.45;
      color: #0f172a;
    }

    code.inline-code {
      font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 8pt;
      background: #f3f4f6;
      color: #111827;
      padding: 1px 3.5px;
      border-radius: 3px;
      border: 1px solid #e5e7eb;
    }

    /* Quotes */
    .sop-quote {
      border-left: 3px solid #e61e73;
      background: #fff0f6;
      padding: 8px 12px;
      margin: 12px 0;
      border-radius: 0 4px 4px 0;
      font-size: 9pt;
      color: #0e2547;
      line-height: 1.5;
    }

    /* Lists */
    ul.sop-list, ol.sop-list {
      margin: 4px 0 10px 18px;
      padding: 0;
    }

    ul.sop-list li, ol.sop-list li {
      margin-bottom: 3px;
      color: #1f2937;
    }

    /* Page Breaks */
    .sop-chapter {
      page-break-before: always;
      padding-top: 6px;
    }

    .sop-chapter:first-of-type {
      page-break-before: auto;
    }

    hr.divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 18px 0;
    }

    .cb {
      font-size: 9pt;
      margin-right: 4px;
    }

    .cb.checked {
      color: #16a34a;
    }

    .doc-link {
      color: #111827;
      font-weight: 500;
    }
  </style>
</head>
<body>

  <!-- Cover Page / Header Block -->
  <div>
    <h1 class="cover-title">Mommantum — Development Docs (SOP)</h1>
    <div class="cover-meta">
      Nov 4, 2026 &middot; @Tanmay
    </div>

    <div class="cover-overview-heading">Overview</div>
    <div class="cover-overview-text">
      This one doc holds the full SOP document set for Mommantum (the High-Growth D2C Agency Web Platform: <code>mommantum</code> Next.js 15 App Router + Supabase + Vercel), written from the code on 4 Nov 2026 under SOP-2 (bring an existing project onto the system).
      <br/><br/>
      To use in the repo: copy each section into its own file (<code>docs/</code> + <code>CLAUDE.md</code> at the root, <code>.env.example</code>). "Current" means what the code does today; "Target" is where SOP-2 refactors take it. <code>prd.md</code> and <code>architecture.md</code> are production baselines.
    </div>

    <div class="table-wrap">
      <table class="sop-table">
        <thead>
          <tr>
            <th style="width: 8%;">Section</th>
            <th style="width: 25%;">SOP file</th>
            <th style="width: 45%;">Answers</th>
            <th style="width: 22%;">Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><code>CLAUDE.md</code></td>
            <td>What Claude Code must read before any change</td>
            <td>CTO (Tanmay)</td>
          </tr>
          <tr>
            <td>2</td>
            <td><code>docs/prd.md</code></td>
            <td>What are we building and why?</td>
            <td>Product, approved by CEO</td>
          </tr>
          <tr>
            <td>3</td>
            <td><code>docs/architecture.md</code></td>
            <td>How is it built and where does each piece live?</td>
            <td>CTO</td>
          </tr>
          <tr>
            <td>4</td>
            <td><code>docs/rules.md</code></td>
            <td>What must every line of code follow?</td>
            <td>CTO, approved by CEO</td>
          </tr>
          <tr>
            <td>5</td>
            <td><code>docs/design.md</code></td>
            <td>How does it look; which tokens and components?</td>
            <td>CTO + UI owner</td>
          </tr>
          <tr>
            <td>6</td>
            <td><code>docs/performance.md</code></td>
            <td>How fast must it be, and what keeps it fast?</td>
            <td>CTO</td>
          </tr>
          <tr>
            <td>7</td>
            <td><code>docs/ai-setup-guide.md</code></td>
            <td>How does the AI stay grounded, secure, cheap and tested?</td>
            <td>CTO</td>
          </tr>
          <tr>
            <td>8</td>
            <td><code>docs/task.md</code></td>
            <td>What is the technical plan for each task?</td>
            <td>Developer, approved by tech lead</td>
          </tr>
          <tr>
            <td>9</td>
            <td><code>docs/memory.md</code></td>
            <td>What have we decided and learned?</td>
            <td>Everyone, curated by tech lead</td>
          </tr>
          <tr>
            <td>10</td>
            <td><code>.env.example</code></td>
            <td>Every env variable, no real values</td>
            <td>CTO</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- All Combined Sections -->
  ${bodyContent}

</body>
</html>`;

const outHtmlPath = path.join(rootDir, 'Mommantum-Development-Docs.html');
fs.writeFileSync(outHtmlPath, htmlDoc, 'utf8');

// Render PDF with exact Chrome flags + header & footer
const { execFileSync } = require('child_process');

// Render PDF with exact Chrome flags + header & footer
const outPdfPath = path.join(rootDir, 'Mommantum-Development-Docs.pdf');
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const headerTpl = '<div style="font-size:7.5pt;color:#9ca3af;font-family:-apple-system,BlinkMacSystemFont,sans-serif;width:100%;padding:0 18mm;display:flex;justify-content:space-between;"><span>Mommantum — Development Docs (SOP)</span><span></span></div>';
const footerTpl = '<div style="font-size:7.5pt;color:#9ca3af;font-family:-apple-system,BlinkMacSystemFont,sans-serif;width:100%;padding:0 18mm;display:flex;justify-content:flex-end;"><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>';

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  `--print-to-pdf=${outPdfPath}`,
  `--header-template=${headerTpl}`,
  `--footer-template=${footerTpl}`,
  `file:///${outHtmlPath.replace(/\\/g, '/')}`
];

execFileSync(chromeExe, args, { stdio: 'inherit' });
console.log('PDF rendered successfully to: ' + outPdfPath);
