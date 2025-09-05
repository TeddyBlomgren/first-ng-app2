import { Routes } from '@angular/router';

export const routes: Routes = [{
    path : '',
    pathMatch : 'full',
    loadComponent: () => {
      return import('./home/home').then(
        c => c.Home);
    }
},
{
    path: 'todos',
    loadComponent: () => {
        return import('./todos/todos').then(
            c => c.Todos);
    }
},
{
    path: 'Spel',
    loadComponent: () => {
        return import('./spel/spel').then(
            c => c.Spel);
    }
},
{
    path: 'Väder',
    loadComponent: () => {
        return import('./vader/vader').then(
            c => c.Vader);
    }
},
{
    path: 'about',
    loadComponent: () => {
        return import('./about/about').then(
            c => c.About);
    }
}

];
