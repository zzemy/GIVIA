const http = require('http');

const data = JSON.stringify({
  country: 'United Kingdom',
  recognition: {
    itemKey: 'tea',
    itemZh: '茶叶',
    itemEn: 'tea',
    category: 'beverage',
    confidence: 0.9,
  },
  giftContext: {
    name: '茶叶',
    description: '西湖龙井',
  },
  audience: {
    relationship: 'friend',
    occasion: 'birthday'
  },
  language: 'zh'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/cultural-generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});
req.on('error', e => console.error(e));
req.write(data);
req.end();
