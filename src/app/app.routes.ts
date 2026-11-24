import { Routes } from '@angular/router';
import { Lander } from './pages/lander';
import { Menu } from './pages/menu';
import { Combos } from './pages/combos';

export const routes: Routes = [
  { path: '', component: Lander, title: 'Cow Dairy Waffles' },
  { path: 'menu', component: Menu, title: 'Our Menu | Cow Dairy Waffles' },
  { path: 'combos', component: Combos, title: 'Combos | Cow Dairy Waffles' },
  { path: '**', redirectTo: '' },
];
