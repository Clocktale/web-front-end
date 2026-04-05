import {
  HttpErrorResponse,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

/** Estilos para `console.log` com `%c` (Chrome / Firefox DevTools). */
const C = {
  requestLabel: 'color:#22d3ee;font-weight:bold;',
  responseLabel: 'color:#4ade80;font-weight:bold;',
  errorLabel: 'color:#f87171;font-weight:bold;',
  status: 'color:#fbbf24;font-weight:bold;',
  message: 'color:#a78bfa;font-weight:bold;',
  key: 'color:#94a3b8;font-weight:600;',
  body: 'color:#e2e8f0;',
} as const;

const ANSI = {
  reset: '\x1b[0m',
  cyan: '\x1b[96m',
  green: '\x1b[92m',
  red: '\x1b[91m',
  yellow: '\x1b[93m',
  magenta: '\x1b[95m',
  dim: '\x1b[2m',
} as const;

function useBrowserConsole(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as unknown as { document?: unknown }).document !==
      'undefined'
  );
}

function maskHeaders(
  headers: HttpRequest<unknown>['headers']
): Record<string, string> {
  const out: Record<string, string> = {};
  headers.keys().forEach(key => {
    const v = headers.get(key);
    if (!v) return;
    const lower = key.toLowerCase();
    if (lower === 'authorization') {
      out[key] = v.startsWith('Bearer ') ? 'Bearer ***' : '***';
    } else {
      out[key] = v;
    }
  });
  return out;
}

function serializeBody(body: unknown): string {
  if (body === null || body === undefined) {
    return '(sem corpo)';
  }
  if (typeof body === 'string') {
    return body;
  }
  if (body instanceof FormData) {
    const parts: string[] = [];
    body.forEach((value, key) => {
      parts.push(
        `${key}=${
          value instanceof File
            ? `[File: ${value.name}, ${value.size} bytes]`
            : String(value)
        }`
      );
    });
    return parts.length ? parts.join('\n') : '(FormData vazio)';
  }
  if (body instanceof Blob) {
    return `[Blob ${body.size} bytes, type=${body.type || 'n/d'}]`;
  }
  if (body instanceof ArrayBuffer) {
    return `[ArrayBuffer ${body.byteLength} bytes]`;
  }
  try {
    return JSON.stringify(body, null, 2);
  } catch {
    return String(body);
  }
}

function formatParams(req: HttpRequest<unknown>): string {
  const keys = req.params.keys();
  if (!keys.length) {
    return '(nenhum)';
  }
  return keys
    .map(k => {
      const all = req.params.getAll(k) ?? [];
      return `${k}=${all.join(',')}`;
    })
    .join('&');
}

function logRequestBrowser(req: HttpRequest<unknown>): void {
  const headers = maskHeaders(req.headers);
  console.groupCollapsed(
    '%c➤ HTTP REQUEST%c %s %s',
    C.requestLabel,
    'color:inherit;',
    req.method,
    req.urlWithParams
  );
  console.log('%cQuery / params', C.key, formatParams(req));
  console.log('%cCorpo', C.key, serializeBody(req.body));
  console.log('%cHeaders', C.key, headers);
  console.groupEnd();
}

function logRequestTerminal(req: HttpRequest<unknown>): void {
  console.log(
    `${ANSI.cyan}[HTTP REQUEST]${ANSI.reset} ${ANSI.dim}${req.method}${ANSI.reset} ${req.urlWithParams}`
  );
  console.log(`${ANSI.dim}params:${ANSI.reset}`, formatParams(req));
  console.log(`${ANSI.dim}body:${ANSI.reset}`, serializeBody(req.body));
  console.log(`${ANSI.dim}headers:${ANSI.reset}`, maskHeaders(req.headers));
}

export function logDevHttpRequest(req: HttpRequest<unknown>): void {
  if (useBrowserConsole()) {
    logRequestBrowser(req);
  } else {
    logRequestTerminal(req);
  }
}

function stringifyResponseBody(body: unknown): string {
  if (body === null || body === undefined) {
    return '(vazio)';
  }
  if (typeof body === 'string') {
    return body;
  }
  try {
    return JSON.stringify(body, null, 2);
  } catch {
    return String(body);
  }
}

function logResponseBrowser(
  req: HttpRequest<unknown>,
  res: HttpResponse<unknown>
): void {
  console.groupCollapsed(
    '%c◀ HTTP RESPONSE%c %s %s',
    C.responseLabel,
    'color:inherit;',
    res.status,
    req.urlWithParams
  );
  console.log('%cStatus', C.status, res.status, res.statusText);
  console.log('%cURL', C.key, req.urlWithParams);
  console.log('%cPayload', C.body, stringifyResponseBody(res.body));
  console.groupEnd();
}

function logResponseTerminal(
  req: HttpRequest<unknown>,
  res: HttpResponse<unknown>
): void {
  console.log(
    `${ANSI.green}[HTTP RESPONSE]${ANSI.reset} ${ANSI.yellow}${res.status}${ANSI.reset} ${res.statusText} ${ANSI.dim}${req.urlWithParams}${ANSI.reset}`
  );
  console.log(`${ANSI.dim}payload:${ANSI.reset}`, stringifyResponseBody(res.body));
}

export function logDevHttpResponse(
  req: HttpRequest<unknown>,
  res: HttpResponse<unknown>
): void {
  if (useBrowserConsole()) {
    logResponseBrowser(req, res);
  } else {
    logResponseTerminal(req, res);
  }
}

function logErrorBrowser(req: HttpRequest<unknown>, err: HttpErrorResponse): void {
  console.groupCollapsed(
    '%c✖ HTTP ERROR%c %s %s',
    C.errorLabel,
    'color:inherit;',
    err.status,
    req.urlWithParams
  );
  console.log('%cStatus', C.status, err.status, err.statusText);
  console.log('%cMessage', C.message, err.message);
  console.log('%cURL', C.key, req.urlWithParams);
  console.log('%cCorpo / erro', C.body, stringifyResponseBody(err.error));
  console.groupEnd();
}

function logErrorTerminal(req: HttpRequest<unknown>, err: HttpErrorResponse): void {
  console.log(
    `${ANSI.red}[HTTP ERROR]${ANSI.reset} ${ANSI.yellow}${err.status}${ANSI.reset} ${err.statusText} ${ANSI.dim}${req.urlWithParams}${ANSI.reset}`
  );
  console.log(`${ANSI.magenta}message:${ANSI.reset}`, err.message);
  console.log(`${ANSI.dim}body:${ANSI.reset}`, stringifyResponseBody(err.error));
}

export function logDevHttpError(
  req: HttpRequest<unknown>,
  err: HttpErrorResponse
): void {
  if (useBrowserConsole()) {
    logErrorBrowser(req, err);
  } else {
    logErrorTerminal(req, err);
  }
}
