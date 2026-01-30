export const environment = {
  production: false,

  /**
   * Base URL for REST API calls.
   * Provided via `.env` as `NG_APP_API_BASE`.
   */
  apiBase: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] ?? 'http://localhost:3001',

  /**
   * Base URL for general backend calls (if needed).
   * Provided via `.env` as `NG_APP_BACKEND_URL`.
   */
  backendUrl: (globalThis as any)?.process?.env?.['NG_APP_BACKEND_URL'] ?? 'http://localhost:3001',

  /**
   * WebSocket URL for realtime delivery tracking.
   * Provided via `.env` as `NG_APP_WS_URL`.
   */
  wsUrl: (globalThis as any)?.process?.env?.['NG_APP_WS_URL'] ?? 'ws://localhost:3001/ws',
};
