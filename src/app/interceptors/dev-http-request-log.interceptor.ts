import { HttpInterceptorFn } from '@angular/common/http';
import { logDevHttpRequest } from './dev-http-log.util';

/**
 * Em desenvolvimento: regista método, URL (com query), parâmetros, corpo e headers (Authorization mascarado).
 */
export const devHttpRequestLogInterceptor: HttpInterceptorFn = (req, next) => {
  logDevHttpRequest(req);
  return next(req);
};
