import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CalculatorsComponent } from './pages/calculators/calculators.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { EstimatesComponent } from './pages/estimates/estimates.component';
import { AuthComponent } from './pages/auth/auth.component';

const appRoutes: Routes = [
  { path: 'calculators', component: CalculatorsComponent},
  { path: '',   redirectTo: '/calculators', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent},
  { path: 'estimates', component: EstimatesComponent},
  { path: 'login', component: AuthComponent},
]

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes), provideAnimationsAsync()]
};
