const http = require('http');
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const { filename, data } = JSON.parse(body);
      const buf = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      fs.writeFileSync(path.join(OUT, filename), buf);
      console.log('✅ Kaydedildi:', filename);
      res.writeHead(200); res.end('ok');
    });
  }
});
server.listen(3334, () => console.log('📡 Save server: http://localhost:3334'));
