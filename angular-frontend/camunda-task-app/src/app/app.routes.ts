/*import { Routes } from '@angular/router';
import { BandejaTareasComponent } from './components/bandeja-tareas/bandeja-tareas';
import { TaskDetailComponent } from './components/task-detail/task-detail';
// ...otros imports

export const routes: Routes = [
  { path: '', redirectTo: '/bandeja-tareas', pathMatch: 'full' },
  { path: 'bandeja-tareas', component: BandejaTareasComponent },
  { path: 'task-detail/:id', component: TaskDetailComponent },
  { path: '**', redirectTo: '/bandeja-tareas', pathMatch: 'full' }
];*/

import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { TaskDetailComponent } from './features/task/task-detail/task-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'task-detail/:id', component: TaskDetailComponent },
  { path: '**', redirectTo: '' }
];

