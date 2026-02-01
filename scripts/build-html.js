const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const uiJsPath = path.join(distDir, 'ui.js');
const uiCssPath = path.join(distDir, 'ui.css');
const uiHtmlPath = path.join(distDir, 'ui.html');

// Read the bundled JavaScript
const jsContent = fs.readFileSync(uiJsPath, 'utf8');

// Read the bundled CSS if it exists
let cssContent = '';
if (fs.existsSync(uiCssPath)) {
  cssContent = fs.readFileSync(uiCssPath, 'utf8');
}

// Create HTML with inline script and styles
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body, #root {
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      color: var(--figma-color-text);
      background-color: var(--figma-color-bg);
    }
    ${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>${jsContent}</script>
</body>
</html>`;

fs.writeFileSync(uiHtmlPath, html);
console.log('Built ui.html successfully');
