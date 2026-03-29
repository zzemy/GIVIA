const http = require('http');

const data = JSON.stringify({
  country: 'Japan',
  countryCode: 'JP',
  locale: 'zh',
  giftContext: {
    name: '茶叶',
    description: '西湖龙井',
  },
  audience: {
    relationship: 'friend',
    occasion: 'birthday'
  }
});

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/analysis/run',
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

req.on('error', e => {
  console.log('Error hitting 3001. Trying 3000...');
  const req2 = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/analysis/run',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }, res2 => {
    let body2 = '';
    res2.on('data', chunk => body2 += chunk);
    res2.on('end', () => console.log('Response 3000:', res2.statusCode, body2));
  });
  req2.on('error', e2 => console.error(e2));
  req2.write(data);
  req2.end();
});

req.write(data);
req.end();
