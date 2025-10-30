import { Routes } from '@angular/router';
import { pagesRoutes } from './pages/pages.routes';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/pages').then(comp => comp.Pages),
        children: pagesRoutes
    }
];
