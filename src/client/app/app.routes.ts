import { provideRouter, RouterConfig } from '@angular/router';

import { AboutRoutes } from './pages/about/index';
import { HomeRoutes } from './pages/home/index';

const routes: RouterConfig = [
  ...HomeRoutes,
  ...AboutRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
