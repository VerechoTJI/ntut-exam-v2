const fs = require('fs');
const file = 'node_modules/piston-judger/dist/client.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "return { success: false, error: error.message || 'POST request failed', details: error.response && error.response.data };",
  "return { success: false, error: (error.message || 'POST request failed') + (error.response && error.response.data ? ' - ' + JSON.stringify(error.response.data) : '') };"
);
fs.writeFileSync(file, content);
