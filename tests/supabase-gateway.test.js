const assert = require('node:assert/strict');
const test = require('node:test');
const express = require('express');
const { createGrocerlyV2Router } = require('../supabaseGateway');

test('v2 endpoints are closed when no publishable key is configured', async () => {
  const prior = process.env.SUPABASE_PUBLISHABLE_KEY;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
  const app = express();
  app.use(express.json());
  app.use('/api/v2', createGrocerlyV2Router());
  const server = app.listen(0);
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const status = await fetch(base + '/api/v2/status').then(r => r.json());
    assert.equal(status.configured, false);
    const res = await fetch(base + '/api/v2/documents/inventory', {
      headers: { Authorization: 'Bearer fake' }
    });
    assert.equal(res.status, 503);
  } finally {
    server.close();
    if (prior === undefined) delete process.env.SUPABASE_PUBLISHABLE_KEY;
    else process.env.SUPABASE_PUBLISHABLE_KEY = prior;
  }
});

test('v2 rejects unverified token; never relies on email supplied in query', async () => {
  const old = process.env.SUPABASE_PUBLISHABLE_KEY;
  process.env.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test_only';
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: false, status: 401 };
  };
  const app = express();
  app.use(express.json());
  app.use('/api/v2', createGrocerlyV2Router({ fetchImpl: fakeFetch }));
  const server = app.listen(0);
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const unauth = await fetch(base + '/api/v2/me?email=someone@example.com');
    assert.equal(unauth.status, 401);
    const forged = await fetch(base + '/api/v2/documents/inventory?email=other@example.com', {
      headers: { Authorization: 'Bearer bogus.jwt.token' }
    });
    assert.equal(forged.status, 401);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/auth\/v1\/user$/);
  } finally {
    server.close();
    if (old === undefined) delete process.env.SUPABASE_PUBLISHABLE_KEY;
    else process.env.SUPABASE_PUBLISHABLE_KEY = old;
  }
});
