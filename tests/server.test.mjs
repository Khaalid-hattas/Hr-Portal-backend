import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { app } from '../server.js';

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

describe('HTTP surface', () => {
  it('reports a healthy API', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
  });

  it('serves the frozen frontend entry point', async () => {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /<!DOCTYPE html>/i);
  });

  it('keeps reports GET available without a reports table', async () => {
    const response = await fetch(`${baseUrl}/api/reports`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { success: true, data: [] });
  });

  it('validates time-off identifiers before accessing MySQL', async () => {
    const response = await fetch(`${baseUrl}/api/timeoff/not-an-id`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, 'id must be a positive integer.');
  });

  it('validates required report fields', async () => {
    const response = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.message, 'Title and type are required.');
  });

  it('returns a safe error for malformed JSON', async () => {
    const response = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{'
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, 'Request body must contain valid JSON.');
  });
});
