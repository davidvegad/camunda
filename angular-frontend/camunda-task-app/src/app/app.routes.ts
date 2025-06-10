import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'bandeja-tareas',
        loadComponent: () =>
          import('./features/task/bandeja-tareas/bandeja-tareas').then(m => m.BandejaTareasComponent)
      },
      {
        path: 'proceso-inicio',
        loadComponent: () =>
          import('./features/process/proceso-inicio/proceso-inicio').then(m => m.ProcesoInicioComponent)
      },
	  {
		path: 'task-detail/:id/:procesoKey/:taskDefinitionKey',
		loadComponent: () =>
		  import('./features/task/task-detail/task-detail').then(m => m.TaskDetailComponent)
	  },
      { path: '', redirectTo: '/bandeja-tareas', pathMatch: 'full' }
    ]
  }
];
