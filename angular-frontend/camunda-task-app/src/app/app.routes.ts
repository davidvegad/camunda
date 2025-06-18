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
			{
				path: 'admin',
				children: [
					{
						path: 'formularios',
						loadComponent: () => import('./admin/formularios/list').then(m => m.list)
					},
					{
						path: 'formularios/nuevo',
						loadComponent: () => import('./admin/formularios/edit').then(m => m.edit)
					},
					{
						path: 'formularios/:id',
						loadComponent: () => import('./admin/formularios/edit').then(m => m.edit)
					},
					{
						path: 'campos',
						loadComponent: () => import('./admin/campos/list').then(m => m.list)
					},
					{
						path: 'campos/nuevo',
						loadComponent: () => import('./admin/campos/edit').then(m => m.edit)
					},
					{
						path: 'campos/:id',
						loadComponent: () => import('./admin/campos/edit').then(m => m.edit)
					},
					{
						path: 'procesos',
						loadComponent: () => import('./admin/procesos/process-admin').then(m => m.ProcessAdmin)
					},
					
					{ path: '', redirectTo: 'formularios', pathMatch: 'full' }
				]
			},
			{ path: '', redirectTo: '/bandeja-tareas', pathMatch: 'full' }
		]
	}
];

