import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, isDevMode, Optional } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { LOGGER_CONFIG, LoggerConfig } from './logger-config';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private config: LoggerConfig;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(LOGGER_CONFIG) config?: LoggerConfig
  ) {
    this.config = {
      enableConsole: true,
      enableRemote: false,
      remoteLogUrl: '/api/logs',
      level: isDevMode() ? 'DEBUG' : 'INFO',
      ...config,
    };
  }

  private canLog(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'): boolean {
    const order = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 } as const;
    if (!this.config.level || this.config.level === 'NONE') {
      return false;
    }
    return order[level] >= order[this.config.level];
  }

  private sendRemote(payload: any) {
    if (!this.config.enableRemote || !this.config.remoteLogUrl) {
      return;
    }
    this.http.post(this.config.remoteLogUrl, payload)
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }

  debug(message: string, details?: any) {
    if (this.canLog('DEBUG') && this.config.enableConsole) {
      console.debug('[DEBUG]', message, details ?? '');
    }
    this.sendRemote({ level: 'DEBUG', message, details, timestamp: new Date().toISOString() });
  }

  info(message: string, details?: any) {
    if (this.canLog('INFO') && this.config.enableConsole) {
      console.info('[INFO]', message, details ?? '');
    }
    this.sendRemote({ level: 'INFO', message, details, timestamp: new Date().toISOString() });
  }

  warn(message: string, details?: any) {
    if (this.canLog('WARN') && this.config.enableConsole) {
      console.warn('[WARN]', message, details ?? '');
    }
    this.sendRemote({ level: 'WARN', message, details, timestamp: new Date().toISOString() });
  }

  error(message: string, details?: any) {
    if (this.canLog('ERROR') && this.config.enableConsole) {
      console.error('[ERROR]', message, details ?? '');
    }
    this.sendRemote({ level: 'ERROR', message, details, timestamp: new Date().toISOString() });
  }
}
