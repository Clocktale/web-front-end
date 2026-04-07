/**
 * Extrai a primeira mensagem por campo do objeto `errors` em respostas de validação (ex.: 422).
 */
export function extractFieldValidationErrors(
  body: unknown
): Record<string, string> | null {
  if (body === null || typeof body !== 'object') {
    return null;
  }

  const errors = (body as Record<string, unknown>)['errors'];
  if (
    errors === null ||
    typeof errors !== 'object' ||
    Array.isArray(errors)
  ) {
    return null;
  }

  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(errors)) {
    if (Array.isArray(val) && val.length > 0) {
      const msg = val[0];
      if (typeof msg === 'string' && msg.trim()) {
        out[key] = msg.trim();
      }
    }
  }

  return Object.keys(out).length > 0 ? out : null;
}
