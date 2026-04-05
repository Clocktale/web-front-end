import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs';
import { logDevHttpError, logDevHttpResponse } from './dev-http-log.util';

/**
 * Em desenvolvimento: regista respostas com status, payload; em erro, status, message e corpo da API.
 */
export const devHttpResponseLogInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap({
      next: event => {
        if (event.type === HttpEventType.Response) {
          logDevHttpResponse(req, event as HttpResponse<unknown>);
        }
      },
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          logDevHttpError(req, err);
        }
      },
    })
  );
};
