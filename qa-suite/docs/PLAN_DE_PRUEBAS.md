# Plan de Pruebas — qa-suite

| Campo | Valor |
|---|---|
| Proyecto | Suite de automatización API + E2E |
| Versión | 1.0 |
| Responsable | _(tu nombre)_ |
| Fecha | _(fecha de entrega)_ |

## 1. Objetivo
Verificar de forma automática y repetible el comportamiento funcional y el tiempo de respuesta de una API REST pública (JSONPlaceholder) y los flujos críticos de una aplicación web de demo (SauceDemo), integrando la ejecución en un pipeline CI/CD con reportes y notificaciones.

## 2. Alcance

### 2.1 Dentro del alcance
| Área | Qué se prueba |
|---|---|
| API `/posts` | GET (lista, por id, filtro `userId`, 404), POST, PUT, PATCH, DELETE |
| API `/users` | GET lista, GET `/users/1/posts` (recurso anidado), 404 |
| Validaciones API | Código de estado, `Content-Type`, JSON Schema (Ajv, draft-07), tiempo de respuesta (< 2000 ms) |
| E2E Login | Credenciales válidas, inválidas, usuario bloqueado, campo vacío, acceso directo sin sesión |
| E2E Navegación | Listado, ordenamiento (precio / nombre), detalle de producto, badge del carrito, logout |
| E2E Checkout | Flujo completo, validación de campos, cálculo subtotal + impuesto = total, cancelación |

### 2.2 Fuera del alcance
- Pruebas de carga/estrés y seguridad (pentest).
- Persistencia real de datos: JSONPlaceholder **simula** escrituras (POST/PUT/DELETE no modifican el servidor).
- Navegadores distintos a Chromium y dispositivos móviles (ampliable vía `projects` en `playwright.config.ts`).
- Usuarios especiales de SauceDemo (`problem_user`, `performance_glitch_user`, etc.).

## 3. Ambientes
| Ambiente | URL | Uso |
|---|---|---|
| API | `https://jsonplaceholder.typicode.com` (variable `API_BASE_URL`) | Pruebas API |
| Web demo | `https://www.saucedemo.com` (variable `E2E_BASE_URL`) | Pruebas E2E |
| Local | Node.js 20+, Chromium vía Playwright | Desarrollo de pruebas |
| CI | GitHub Actions, `ubuntu-latest`, Node 20 | Ejecución automática |

**Datos de prueba:** `standard_user` / `secret_sauce`, `locked_out_user` / `secret_sauce` (públicos, documentados por SauceDemo). No se manejan secretos reales; el único secreto opcional es `SLACK_WEBHOOK_URL`.

## 4. Herramientas
| Necesidad | Herramienta |
|---|---|
| Framework de pruebas API y E2E | Playwright Test (TypeScript) |
| Validación de JSON Schema | Ajv 8 |
| Patrón de diseño E2E | Page Object Model + fixtures |
| Reportes | Playwright HTML, Allure Report, reporter JSON |
| CI/CD | GitHub Actions |
| Notificación | Resumen en la corrida + Slack Webhook (opcional) + correos nativos de GitHub en fallo |
| Control de versiones | Git / GitHub |

## 5. Estrategia
1. **API:** pruebas de contrato (schema), funcionales (CRUD) y de rendimiento ligero (umbral de latencia por request).
2. **E2E:** caminos felices y negativos de los flujos críticos; selectores `data-test` para estabilidad.
3. **Aislamiento:** cada prueba es independiente (sin orden ni estado compartido) y corre en paralelo.
4. **Resiliencia:** 2 reintentos en CI; traza, captura y video solo ante fallo.
5. **Ejecución en CI:** jobs `api-tests` y `e2e-tests` en paralelo → `allure-report` → `notify`.

## 6. Criterios de entrada
- Repositorio clonado y `npm ci` exitoso.
- Ambientes (API y web demo) accesibles (HTTP 200 en URL base).
- Chromium instalado (`npx playwright install chromium`).
- Pruebas compilan sin errores (`npm run typecheck`).

## 7. Criterios de salida
| Criterio | Umbral |
|---|---|
| Casos ejecutados | 100 % de los 26 casos planificados |
| Casos aprobados | ≥ 95 % (en CI se excluye flakiness resuelta por reintento) |
| Defectos críticos / bloqueantes abiertos | 0 |
| Tiempo de respuesta API | < 2000 ms por request |
| Pipeline | Verde en la rama `main` |
| Reportes | Playwright HTML y Allure generados y publicados como artefactos |

## 8. Criterios de suspensión / reanudación
- **Suspender** si el ambiente no responde (API/web caída) o si falla la instalación de dependencias.
- **Reanudar** cuando el ambiente vuelva a responder y se re-ejecute el pipeline completo.

## 9. Matriz de casos (resumen)
| ID | Suite | Caso | Resultado esperado |
|---|---|---|---|
| API-01 | posts | GET /posts | 200, 100 items, schema OK, < 2 s |
| API-02 | posts | GET /posts/1 | 200, id = 1, schema OK |
| API-03 | posts | GET /posts?userId=1 | Solo posts del usuario 1 |
| API-04 | posts | GET /posts/99999 | 404 |
| API-05 | posts | POST /posts | 201, eco del payload + id |
| API-06 | posts | PUT /posts/1 | 200, recurso reemplazado |
| API-07 | posts | PATCH /posts/1 | 200, campo actualizado |
| API-08 | posts | DELETE /posts/1 | 200, cuerpo `{}` |
| API-09 | users | GET /users | 200, 10 items, schema OK |
| API-10 | users | GET /users/1/posts | 200, posts del usuario 1 |
| API-11 | users | GET /users/99999 | 404 |
| E2E-01 | login | Login válido | Redirige a inventario (6 productos) |
| E2E-02 | login | Contraseña incorrecta | Mensaje de error |
| E2E-03 | login | Usuario bloqueado | Mensaje "locked out" |
| E2E-04 | login | Usuario vacío | "Username is required" |
| E2E-05 | login | Acceso directo sin sesión | Error de acceso |
| E2E-06 | navegación | Listado de productos | 6 items |
| E2E-07 | navegación | Orden precio bajo → alto | Precios ascendentes |
| E2E-08 | navegación | Orden nombre Z → A | Nombres descendentes |
| E2E-09 | navegación | Detalle y regreso | URL y nombre correctos |
| E2E-10 | navegación | Agregar/quitar del carrito | Badge se actualiza |
| E2E-11 | navegación | Logout | Regresa a login |
| E2E-12 | checkout | Flujo completo | "Thank you for your order!" |
| E2E-13 | checkout | Cálculo de totales | subtotal + tax = total |
| E2E-14 | checkout | Nombre requerido | "First Name is required" |
| E2E-15 | checkout | Cancelar | Regresa al carrito |

## 10. Riesgos y mitigación
| Riesgo | Mitigación |
|---|---|
| Servicios públicos inestables o con rate limit | Reintentos en CI, umbral de latencia configurable (`API_MAX_MS`), ambientes parametrizables por variable |
| Cambios en el DOM de SauceDemo | Selectores `data-test` + Page Objects (un solo punto de cambio) |
| JSONPlaceholder no persiste escrituras | Se valida el eco de la respuesta, no el estado posterior |
| Flakiness en E2E | Auto-wait de Playwright, `expect` con reintento, trazas en primer reintento |

## 11. Entregables
Repositorio (`tests/`, `pages/`, `src/`, `.github/workflows/ci.yml`), este plan, reporte de ejecución (`docs/REPORTE_EJECUCION.md`), reportes Playwright HTML y Allure (artefactos de CI).

## 12. Métricas
Total / aprobados / fallidos / flaky, duración por suite, tasa de éxito del pipeline, latencia máxima observada en API.
