const https = require('https');

const token = "APP_USR-1784155304537631-072912-fdbe076724da15ee54c65b1d95f16f6f-2523873477";
const preapproval_plan_id = "f3fdfc71771f4eb3b874dee456afe529";

const data = JSON.stringify({
  auto_recurring: {
    frequency: 1,
    frequency_type: "months",
    transaction_amount: 14000,
    currency_id: "ARS"
  },
  payer_email: "test_user_123456@testuser.com",
  back_url: "https://www.yoursite.com/dashboard/upgrade?status=success",
  external_reference: "some-uuid",
  reason: "PresupuestoYA Pro"
});

const req = https.request({
  hostname: 'api.mercadopago.com',
  port: 443,
  path: `/preapproval`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(res.statusCode, body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
