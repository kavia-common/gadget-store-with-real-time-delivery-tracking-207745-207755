export const environment = {
  production: true,
  apiBase: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] ?? 'http://localhost:3001',
  backendUrl: (globalThis as any)?.process?.env?.['NG_APP_BACKEND_URL'] ?? 'http://localhost:3001',
  wsUrl: (globalThis as any)?.process?.env?.['NG_APP_WS_URL'] ?? 'ws://localhost:3001/ws',
};
