import { HttpRequest, HttpResponse, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

export const logInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const logger = inject(LoggerService);
  const start = Date.now();

  logger.debug('HTTP request', { method: req.method, url: req.urlWithParams });

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - start;
          logger.info('HTTP response', {
            method: req.method,
            url: req.urlWithParams,
            status: event.status,
            durationMs: elapsed,
          });
        }
      },
      error: (error) => {
        const elapsed = Date.now() - start;
        logger.error('HTTP error', {
          method: req.method,
          url: req.urlWithParams,
          error,
          durationMs: elapsed,
        });
      },
    })
  );
};
