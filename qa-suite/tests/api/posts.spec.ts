import { test, expect } from '@playwright/test';
import postSchema from '../../src/schemas/post.schema.json';
import { assertSchema, compileSchema, MAX_MS, timed } from '../../src/helpers';

const validatePost = compileSchema(postSchema);

test.describe('API /posts — JSONPlaceholder', () => {
  test('GET /posts → 200, lista de 100 posts con schema válido', async ({ request }) => {
    const { res, ms } = await timed(() => request.get('/posts'));
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    expect(ms).toBeLessThan(MAX_MS);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(100);
    body.forEach((p: unknown) => assertSchema(validatePost, p));
  });

  test('GET /posts/1 → 200, schema válido e id correcto', async ({ request }) => {
    const { res, ms } = await timed(() => request.get('/posts/1'));
    expect(res.status()).toBe(200);
    expect(ms).toBeLessThan(MAX_MS);

    const body = await res.json();
    assertSchema(validatePost, body);
    expect(body.id).toBe(1);
  });

  test('GET /posts?userId=1 → solo posts del usuario 1', async ({ request }) => {
    const res = await request.get('/posts', { params: { userId: 1 } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    body.forEach((p: { userId: number }) => expect(p.userId).toBe(1));
  });

  test('GET /posts/99999 → 404 (recurso inexistente)', async ({ request }) => {
    const res = await request.get('/posts/99999');
    expect(res.status()).toBe(404);
  });

  test('POST /posts → 201, devuelve el recurso creado con id', async ({ request }) => {
    const payload = { title: 'qa-suite title', body: 'qa-suite body', userId: 1 };
    const { res, ms } = await timed(() => request.post('/posts', { data: payload }));
    expect(res.status()).toBe(201);
    expect(ms).toBeLessThan(MAX_MS);

    const body = await res.json();
    assertSchema(validatePost, body);
    expect(body).toMatchObject(payload);
    expect(body.id).toBeGreaterThan(0);
  });

  test('PUT /posts/1 → 200, reemplaza el recurso', async ({ request }) => {
    const payload = { id: 1, title: 'updated', body: 'updated body', userId: 1 };
    const { res, ms } = await timed(() => request.put('/posts/1', { data: payload }));
    expect(res.status()).toBe(200);
    expect(ms).toBeLessThan(MAX_MS);

    const body = await res.json();
    assertSchema(validatePost, body);
    expect(body).toMatchObject(payload);
  });

  test('PATCH /posts/1 → 200, actualiza parcialmente', async ({ request }) => {
    const res = await request.patch('/posts/1', { data: { title: 'patched' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    assertSchema(validatePost, body);
    expect(body.title).toBe('patched');
  });

  test('DELETE /posts/1 → 200, cuerpo vacío', async ({ request }) => {
    const { res, ms } = await timed(() => request.delete('/posts/1'));
    expect(res.status()).toBe(200);
    expect(ms).toBeLessThan(MAX_MS);
    expect(await res.json()).toEqual({});
  });
});
