# qa-suite

Suite de pruebas automatizadas con **Playwright + TypeScript**:

- **API** contra [JSONPlaceholder](https://jsonplaceholder.typicode.com): GET, POST, PUT, PATCH, DELETE — código de estado, JSON Schema (Ajv) y tiempo de respuesta.
- **E2E** contra [SauceDemo](https://www.saucedemo.com): login, navegación y checkout (Page Object Model).
- **CI** en GitHub Actions con reportes Playwright HTML + Allure y notificación.

## Uso local
```bash
npm ci
npx playwright install chromium

npm test              # todo (26 tests)
npm run test:api      # solo API
npm run test:e2e      # solo E2E
npm run report:html   # reporte Playwright
npm run report:allure # reporte Allure (requiere Java 8+)
```

Variables opcionales: `API_BASE_URL`, `E2E_BASE_URL`, `API_MAX_MS` (default 2000).

## Estructura
```
.github/workflows/ci.yml   pipeline
docs/                      plan de pruebas + reporte de ejecución
pages/                     Page Objects (SauceDemo)
src/                       schemas JSON y helpers
tests/api | tests/e2e      specs
scripts/summarize.mjs      resumen para GitHub Actions
```

## Pipeline (`ci.yml`)
Se ejecuta en cada `push`, `pull_request`, manualmente y L-V por cron.
`api-tests` ∥ `e2e-tests` → `allure-report` → `publish-report` (Pages, solo `main`) · `notify`.

**Configuración única en GitHub:**
1. *Settings → Pages → Source: GitHub Actions* (para publicar Allure).
2. *(Opcional)* *Settings → Secrets → Actions →* `SLACK_WEBHOOK_URL` para notificar a Slack.
3. Los correos de fallo los envía GitHub por defecto (*Settings → Notifications*).
