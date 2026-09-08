import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorBody } from '../models/api-response.model';
import { NotificationService } from '../services/notification.service';

const FALLBACK_MESSAGE = 'Ocurrio un error inesperado. Intenta nuevamente.';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const body = err.error as ApiErrorBody | undefined;
      const message = body?.error?.message ?? FALLBACK_MESSAGE;
      notificationService.error(message);
      return throwError(() => err);
    }),
  );
};
