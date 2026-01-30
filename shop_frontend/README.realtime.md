# Realtime delivery tracking (Frontend)

## Environment variables
This Angular app reads configuration via `.env` keys (already present in the container):

- `NG_APP_API_BASE` – REST base URL (e.g. `https://...:3001`)
- `NG_APP_WS_URL` – WebSocket URL (e.g. `ws://...:3001/ws`)

## Backend API discovery note
The backend Swagger UI at `/docs` currently embeds only a health endpoint (`/`) in `swaggerDoc`.  
Product/order endpoints may exist but are not exposed in the swagger spec yet.

The frontend `ApiService` is implemented to:
- call expected endpoints (`/api/products`, `/api/orders`, `/api/checkout`) when available
- gracefully fall back to a mock catalog + mock checkout so the full UI flow works end-to-end
