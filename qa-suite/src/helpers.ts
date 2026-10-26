import Ajv, { ValidateFunction } from 'ajv';
import { APIResponse, expect } from '@playwright/test';

/** Umbral de tiempo de respuesta (ms). Configurable con API_MAX_MS. */
export const MAX_MS = Number(process.env.API_MAX_MS ?? 2000);

const ajv = new Ajv({ allErrors: true, strict: true });

export const compileSchema = (schema: object): ValidateFunction => ajv.compile(schema);

export function assertSchema(validate: ValidateFunction, data: unknown): void {
  const ok = validate(data);
  expect(ok, ajv.errorsText(validate.errors)).toBe(true);
}

/** Ejecuta una llamada y devuelve la respuesta + duración en ms. */
export async function timed(call: () => Promise<APIResponse>) {
  const t0 = performance.now();
  const res = await call();
  return { res, ms: Math.round(performance.now() - t0) };
}

export const parsePrice = (text: string): number => Number(text.replace(/[^0-9.]/g, ''));
