const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..');

fs.readdirSync(outputDir).forEach((file) => {
  if (!file.endsWith('.js') || file === 'index.js') return;
  fs.unlinkSync(path.join(outputDir, file));
})
