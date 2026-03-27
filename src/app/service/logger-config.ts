import { InjectionToken } from '@angular/core';

export interface LoggerConfig {
  enableConsole?: boolean;
  enableRemote?: boolean;
  remoteLogUrl?: string;
  level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';
}

export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('LOGGER_CONFIG');
