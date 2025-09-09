import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./home/home').then((c) => c.Home);
    },
  },
  {
    path: 'todos',
    loadComponent: () => {
      return import('./todos/todos').then((c) => c.Todos);
    },
  },

  {
    path: 'spel',
    loadComponent: () => import('./games/games').then((c) => c.SpelComponent),
    children: [
      {
        path: 'sudoku',
        loadComponent: () => import('./games/sudoku/sudoku').then((c) => c.SudokuComponent),
      },
      {
        path: 'tic-tac-toe',
        loadComponent: () =>
          import('./games/tic-tac-toe/tic-tac-toe').then((c) => c.TicTacToeComponent),
      },
      {
        path: 'four-in-a-row',
        loadComponent: () =>
          import('./games/four-in-a-row/four-in-a-row').then((c) => c.FourInARowModel),
      },
      {
        path: 'snake',
        loadComponent: () => import('./games/snake/snake').then((c) => c.AppComponent),
      },
    ],
  },
  {
    path: 'Väder',
    loadComponent: () => {
      return import('./weather/weather').then((c) => c.weather);
    },
  },
  {
    path: 'about',
    loadComponent: () => {
      return import('./about/about').then((c) => c.About);
    },
  },
];

/*{
  path: 'tic-tac-toe',
  loadComponent: () =>
    import('./spel/tic-tac-toe/tic-tac-toe').then(c => c.TicTacToeComponent)
},
{
  path: 'four-in-a-row',
  loadComponent: () =>
    import('./spel/four-in-a-row/four-in-a-row').then(c => c.FourInARowComponent)
},
{
  path: 'snake',
  loadComponent: () =>
    import('./spel/snake/snake').then(c => c.SnakeComponent)
}
*/
