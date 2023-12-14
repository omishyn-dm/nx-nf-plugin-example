import {InjectionToken} from '@angular/core';

export const MfSettingsInjectionToken = new InjectionToken<any>(
  'module federation token'
);

export const MfInjectorToken = new InjectionToken<any>('injector federation token');

export const RouteInitializer = new InjectionToken<any>('Route Initializer');
