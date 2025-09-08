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
    loadComponent: () => import('./spel/spel').then((c) => c.SpelComponent),
    children: [
      {
        path: 'sudoku',
        loadComponent: () => import('./spel/sudoku/sudoku').then((c) => c.SudokuComponent),
      },
      {
        path: 'tic-tac-toe',
        loadComponent: () => import('./spel/tic-tac-toe/tic-tac-toe').then((c) => c.TicTacToe),
      },
      {
        path: 'four-in-a-row',
        loadComponent: () => import('./spel/four-in-a-row/four-in-a-row').then((c) => c.FourInARow),
      },
      {
        path: 'snake',
        loadComponent: () => import('./spel/snake/snake').then((c) => c.AppComponent),
      },
    ],
  },
  {
    path: 'Väder',
    loadComponent: () => {
      return import('./vader/vader').then((c) => c.Vader);
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
