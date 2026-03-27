import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { logInterceptor } from './service/log-interceptor';
import { LOGGER_CONFIG } from './service/logger-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([logInterceptor])),
    {
      provide: LOGGER_CONFIG,
      useValue: {
        enableConsole: true,
        enableRemote: false,
        // In production, set enableRemote=true and remoteLogUrl to your backend logging endpoint.
        remoteLogUrl: '/api/logs',
        level: 'DEBUG',
      },
    },
  ],
};
