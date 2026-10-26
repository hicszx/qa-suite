// Lee reports/results.json (reporter JSON de Playwright) y escribe un resumen en Markdown.
// En CI lo agrega a $GITHUB_STEP_SUMMARY; local lo imprime en consola.
import { readFileSync, appendFileSync, existsSync } from 'node:fs';

const label = process.argv[2] ?? 'tests';
const file = 'reports/results.json';
if (!existsSync(file)) {
  console.error(`No existe ${file}`);
  process.exit(0);
}
const { stats } = JSON.parse(readFileSync(file, 'utf8'));
const md = [
  `### Resultados: ${label}`,
  '',
  '| Passed | Failed | Flaky | Skipped | Duración |',
  '|:--:|:--:|:--:|:--:|:--:|',
  `| ${stats.expected} | ${stats.unexpected} | ${stats.flaky} | ${stats.skipped} | ${(stats.duration / 1000).toFixed(1)} s |`,
  '',
].join('\n');

if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
else console.log(md);
