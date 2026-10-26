# Reporte de Ejecución

> Completar con los datos de una corrida real del pipeline (pestaña **Actions** → corrida → *Summary*) y adjuntar capturas del reporte Allure.

| Campo | Valor |
|---|---|
| Fecha | |
| Commit / rama | |
| Enlace a la corrida de Actions | |
| Enlace al reporte Allure (Pages) | |

## Resultados por suite
| Suite | Total | Passed | Failed | Flaky | Skipped | Duración |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| API | 11 | | | | | |
| E2E | 15 | | | | | |
| **Total** | **26** | | | | | |

## Tiempos de respuesta API (ms)
| Endpoint | Método | Medido | Umbral |
|---|---|:--:|:--:|
| /posts | GET | | 2000 |
| /posts/1 | GET | | 2000 |
| /posts | POST | | 2000 |
| /posts/1 | PUT | | 2000 |
| /posts/1 | DELETE | | 2000 |
| /users | GET | | 2000 |

## Defectos / observaciones
| ID | Descripción | Severidad | Estado |
|---|---|---|---|
| | | | |

## Conclusión (criterios de salida)
- [ ] 100 % de casos ejecutados
- [ ] ≥ 95 % aprobados
- [ ] 0 defectos críticos abiertos
- [ ] Latencia API < 2000 ms
- [ ] Pipeline verde en `main`

**Veredicto:** ☐ Aprobado ☐ Aprobado con observaciones ☐ Rechazado
