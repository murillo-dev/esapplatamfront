import { Routes } from "@angular/router";

export const pagesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then(comp => comp.Dashboard)
    },
    {
        path: 'transfer',
        loadComponent: () => import('./transfer-panel/transfer-panel').then(comp => comp.TransferPanel)
    }

];

