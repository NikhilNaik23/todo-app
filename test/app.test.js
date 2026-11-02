const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

test('todo lifecycle', async () => {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const json = { 'Content-Type': 'application/json' };

  try {
    const bad = await fetch(`${base}/todos`, { method: 'POST', headers: json, body: '{}' });
    assert.strictEqual(bad.status, 400);

    const created = await fetch(`${base}/todos`, {
      method: 'POST', headers: json, body: JSON.stringify({ title: 'learn gitops' }),
    });
    assert.strictEqual(created.status, 201);
    const todo = await created.json();

    const patched = await fetch(`${base}/todos/${todo.id}`, {
      method: 'PATCH', headers: json, body: JSON.stringify({ done: true }),
    });
    assert.strictEqual((await patched.json()).done, true);

    const del = await fetch(`${base}/todos/${todo.id}`, { method: 'DELETE' });
    assert.strictEqual(del.status, 204);
  } finally {
    server.close();
  }
});