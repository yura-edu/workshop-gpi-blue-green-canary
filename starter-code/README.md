# Blue-Green / Canary Deployment

> **Tipo:** DEVOPS_CONFIG · **Duración estimada:** 300 min · **Nivel:** Avanzado (nivel 3)

## Objetivo

Diseñar y ejecutar un deployment **Blue-Green** o **Canary** sobre dos instancias en Docker Compose, con health checks configurados, traffic split simulado y rollback automático ante fallo de health check.

---

## Estructura del starter

```
.
├── app/
│   ├── v1/          # API estable — GET /api/version → {"version":"1.0.0"}
│   └── v2/          # Nueva versión — GET /api/version → {"version":"2.0.0"}
├── nginx/
│   └── nginx.conf.template   # Completa este template
├── docs/            # Aquí irá tu deploy-strategy.md
└── scripts/         # Aquí irán tus scripts de rollout/rollback
```

### Endpoints de las apps

| Endpoint | Respuesta |
|---|---|
| `GET /api/version` | `{"version":"1.0.0"}` (v1) / `{"version":"2.0.0","features":["new-feature"]}` (v2) |
| `GET /health` | `{"ok":true}` (200) en condición normal |
| `GET /health` con `FORCE_UNHEALTHY=true` | `{"ok":false,...}` (500) — simula deploy fallido |

---

## Instrucciones

### 1. Elige tu estrategia

**Blue-Green** o **Canary**. Justifica tu elección en `docs/deploy-strategy.md`.

### 2. Crea el compose file

Crea **uno** de los siguientes archivos según la estrategia elegida:

- `compose.blue-green.yml` — dos servicios app (blue + green) + Nginx
- `compose.canary.yml` — servicio estable + servicio canary + Nginx con upstream ponderado

Completa `nginx/nginx.conf.template` para configurar el tráfico según tu estrategia.

```yaml
# Ejemplo mínimo de estructura (adapta a tu estrategia)
services:
  app-blue:
    build: ./app/v1
    environment:
      - FORCE_UNHEALTHY=false
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app-blue
```

### 3. Implementa los scripts

Crea los scripts de rollout y rollback en `scripts/`:

**Para Blue-Green:**
- `scripts/rollout.sh` — cambia el tráfico de blue a green; verifica health check; ejecuta rollback si falla
- `scripts/rollback.sh` — revierte el tráfico a blue

**Para Canary:**
- `scripts/canary-promote.sh` — aumenta el peso del canary (10% → 50% → 100%)
- `scripts/canary-rollback.sh` — lleva el peso del canary a 0%

Los scripts deben usar `/bin/sh` (no bash-only features) para máxima compatibilidad.

### 4. Documenta la estrategia

Crea `docs/deploy-strategy.md` con:
- Estrategia elegida y justificación
- Procedimiento de rollout paso a paso
- **Sección de Rollback**: cuándo y cómo se activa, con los comandos exactos
- (Opcional) Criterios de éxito/abort (% de errores, p95 de latencia)

### 5. Verifica localmente

```bash
# Levanta el stack
docker compose -f compose.blue-green.yml up -d

# Verifica el tráfico
curl http://localhost:8080/api/version

# Simula un deploy fallido
docker compose -f compose.blue-green.yml run --rm -e FORCE_UNHEALTHY=true app-green

# Ejecuta rollout (debe detectar el fallo y hacer rollback)
sh scripts/rollout.sh
```

### 6. Graba el video (≤ 5 min)

Demuestra:
1. El stack corriendo con tráfico en v1
2. El rollout hacia v2 (muestra los headers `X-Upstream-Addr` o los logs)
3. El rollback automático cuando `FORCE_UNHEALTHY=true`

Sube el video a Loom, YouTube o Google Drive y pega el link en tu PR.

### 7. Abre el PR

El CI validará automáticamente:
- ✅ El YAML de tu compose file es válido
- ✅ Los servicios tienen `healthcheck` configurado
- ✅ `docs/deploy-strategy.md` tiene una sección de rollback

---

## Criterios de evaluación automática (60%)

| Criterio | Umbral |
|---|---|
| Compose file es YAML válido | 100% |
| Rollback documentado en `docs/deploy-strategy.md` | 100% |
| Health check configurado en los servicios del compose | 100% |
| CI pasa | 100% |

## Criterios docente (40%)

| Criterio | Requerido |
|---|---|
| Video muestra tráfico dividido (evidencia en logs/headers) | Sí |
| Rollback se activa automáticamente ante health-check fallido | Sí |
| Se justifica la estrategia elegida | Sí |
| Documenta criterio de éxito/abort | No (opcional) |

---

## Recursos

- [Docker Compose healthcheck](https://docs.docker.com/compose/compose-file/05-services/#healthcheck)
- [Nginx upstream module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Blue-Green Deployment — Martin Fowler](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Canary releases — Martin Fowler](https://martinfowler.com/bliki/CanaryRelease.html)
