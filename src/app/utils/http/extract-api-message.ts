/**
 * Extrai mensagem legível do padrão do back-end (`message`, texto plano, erros Laravel).
 */
export function extractApiMessage(body: unknown): string | null {
  if (body === null || body === undefined) {
    return null;
  }

  if (typeof body === 'string') {
    const t = body.trim();
    return t.length > 0 ? t : null;
  }

  if (typeof body !== 'object') {
    return null;
  }

  const o = body as Record<string, unknown>;

  if (typeof o['message'] === 'string' && o['message'].trim()) {
    return o['message'].trim();
  }

  const errors = o['errors'];
  if (
    errors !== null &&
    typeof errors === 'object' &&
    !Array.isArray(errors)
  ) {
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const firstVal = (errors as Record<string, unknown>)[firstKey];
      if (Array.isArray(firstVal) && firstVal.length > 0) {
        const msg = firstVal[0];
        if (typeof msg === 'string' && msg.trim()) {
          return msg.trim();
        }
      }
    }
  }

  return null;
}

/**
 * Envelopes `{ success: false, message?: string }` em respostas 200.
 */
export function extractEnvelopeFailureMessage(response: unknown): string | null {
  if (response === null || typeof response !== 'object') {
    return null;
  }
  const r = response as Record<string, unknown>;
  if (r['success'] !== false) {
    return null;
  }
  if (typeof r['message'] === 'string' && r['message'].trim()) {
    return r['message'].trim();
  }
  return null;
}
