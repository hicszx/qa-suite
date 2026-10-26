import { test, expect } from '@playwright/test';
import userSchema from '../../src/schemas/user.schema.json';
import { assertSchema, compileSchema, MAX_MS, timed } from '../../src/helpers';

const validateUser = compileSchema(userSchema);

test.describe('API /users — JSONPlaceholder', () => {
  test('GET /users → 200, 10 usuarios con schema válido', async ({ request }) => {
    const { res, ms } = await timed(() => request.get('/users'));
    expect(res.status()).toBe(200);
    expect(ms).toBeLessThan(MAX_MS);

    const body = await res.json();
    expect(body).toHaveLength(10);
    body.forEach((u: unknown) => assertSchema(validateUser, u));
  });

  test('GET /users/1/posts → 200, posts anidados del usuario', async ({ request }) => {
    const res = await request.get('/users/1/posts');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    body.forEach((p: { userId: number }) => expect(p.userId).toBe(1));
  });

  test('GET /users/99999 → 404', async ({ request }) => {
    const res = await request.get('/users/99999');
    expect(res.status()).toBe(404);
  });
});
