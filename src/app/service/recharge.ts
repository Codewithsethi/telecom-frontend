import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class Recharge {
  
  // Point to middleware backend (set to actual deployed host in production)
  private url ='http://localhost:8087/api/recharge';

  constructor(private http: HttpClient, private logger: LoggerService) {}

  recharge(mobile: string, amount: number) {
    this.logger.info('User sending request to middleware', { mobile, amount });
    return this.http.post<any>(this.url, {
      mobile: mobile,
      amount: amount
    }).pipe(
      tap(() => {
        this.logger.info('Middleware connected');
      }),
      catchError((error) => {
        this.logger.warn('Not connected', { error: error.message || error });
        return throwError(() => error);
      })
    );
  }
}
