import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'heroes',
        loadComponent: () => import('./features/heroes/hero-list/hero-list').then(c => c.HeroList)
    },
    {
        path: 'heroes/new',
        loadComponent: () => import('./features/heroes/hero-form/hero-form').then(c => c.HeroForm)
    },
    {
        path: 'heroes/edit/:id',
        loadComponent: () => import('./features/heroes/hero-form/hero-form').then(c => c.HeroForm)
    },
    { path: '', redirectTo: '/heroes', pathMatch: 'full' },
    {  path: '**', redirectTo: '/heroes' }
];
