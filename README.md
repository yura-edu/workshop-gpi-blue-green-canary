# Workshop: Blue-Green / Canary Deployment

> **Slug:** `gpi-blue-green-canary` · **Tipo:** DEVOPS_CONFIG · **Nivel:** 3

## Descripción

Taller donde el estudiante implementa una estrategia de deployment Blue-Green o Canary usando Docker Compose, con health checks, traffic split y rollback automático.

## Estructura

```
gpi-blue-green-canary/
├── starter-code/           # Código de inicio para el estudiante
│   ├── app/
│   │   ├── v1/             # App estable (GET /api/version → 1.0.0)
│   │   └── v2/             # Nueva versión (GET /api/version → 2.0.0)
│   ├── nginx/
│   │   └── nginx.conf.template
│   └── .github/workflows/ci.yml
├── grader-config.json
└── implementation-plan.md
```

## El estudiante debe crear

- `compose.blue-green.yml` o `compose.canary.yml`
- `scripts/rollout.sh` y `scripts/rollback.sh`
- `docs/deploy-strategy.md`

## Evaluación automática

Ver `grader-config.json` para los pesos y umbrales de cada métrica.
