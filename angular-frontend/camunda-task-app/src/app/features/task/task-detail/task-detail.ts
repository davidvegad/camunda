import { Component, ViewChildren, QueryList, OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../../core/services/proceso';
import { TareaCabeceraService } from './tarea-cabecera.service';
import { ProcesoVariablesService } from './proceso-variables.service';
import { FormularioDinamicoComponent } from '../../formularios/formulario-dinamico/formulario-dinamico'; 
import { TareaCabecera } from './tarea-cabecera.model';




@Component({
	selector: 'app-task-detail',
	standalone: true,
	imports: [CommonModule, FormsModule,FormularioDinamicoComponent],
	styleUrls: ['./task-detail.css'],
	templateUrl: './task-detail.html',
})
export class TaskDetailComponent implements OnInit {
	@ViewChildren(FormularioDinamicoComponent) formulariosDinamicos!: QueryList<FormularioDinamicoComponent>;
	task: any = null;
	formFields: any[] = [];
	formData: { [key: string]: any } = {};
	isLoading: boolean = false;
	errorMensaje: string = '';
	releaseMessage: string = '';
	releaseError: string = '';
	tareaId: string = '';
	mensaje : string = '';
	
	private processInstanceId = '';
	
	//private processInstanceId : string = ''; // HARDCODE
	
	formularios: any[] = [];
	selectedTab: number = 0; // <-- AQUI ESTABA FALTANDO
	
	respuestas: { [id: string]: any } = {};
	pestanaActiva: number = 0;
	
	@Input() variables: Record<string, any> = {};
	
	cabecera: TareaCabecera[] = [];
	
	constructor(
		private procesoService: ProcesoService,
		private route: ActivatedRoute,
		private router: Router,
		private variablesService: ProcesoVariablesService,
		private cabeceraService: TareaCabeceraService
	) {}
	
	ngOnInit(): void {
		
		this.tareaId = this.route.snapshot.paramMap.get('id') || '';
		if (this.tareaId) {
			this.procesoService.obtenerTareaDetalle(this.tareaId).subscribe(task => {
				
				//this.task = tarea;
				this.processInstanceId = task.processInstanceId;
				this.isLoading = false;
				
				if (this.processInstanceId) {
					this.variablesService.getVariables(this.processInstanceId)
					.subscribe(vars => this.variables = vars);
				}
				},
				(err: any) => {
					this.errorMensaje = 'Error al cargar tarea: ' + (err?.message || err);
					this.isLoading = false;
				}
			);
			
			} else {
			this.errorMensaje = 'No se proporcionó ID de tarea.';
			}
			// Obtener datos de la tarea según tu navegación/routing
			const procesoKey = this.route.snapshot.paramMap.get('procesoKey')!;
			const taskDefinitionKey = this.route.snapshot.paramMap.get('taskDefinitionKey')!;
			
			this.isLoading = true;
			this.cabeceraService.getCabecera(procesoKey, taskDefinitionKey)
			.subscribe(cab => 
				this.cabecera = cab.map(c => ({
					...c,
					nombreVariable: c.nombreVariable
				})).sort((a, b) => a.orden - b.orden)
			);
		this.procesoService.obtenerFormulariosPorTarea(procesoKey, taskDefinitionKey)
		.subscribe({
			next: formularios => {
				this.formularios = formularios;
				this.isLoading = false;
			},
			error: err => {
			alert('No se pudieron obtener formularios');
			this.isLoading = false;
			}
		});
	}
	
	cambiarTab(idx: number) {
		this.selectedTab = idx;
	}
	
	onFormValido(form: any, formulario: any) {
		this.respuestas[formulario.id] = form.value;
	}
	
	cargarDetalleTarea(): void {
		this.isLoading = true;
		this.procesoService.obtenerTareaDetalle(this.tareaId).subscribe(
			(tarea: any) => {
				this.task = tarea;
				this.processInstanceId = tarea.processInstanceId;
				alert(this.processInstanceId);
				this.isLoading = false;
			},
			(err: any) => {
				this.errorMensaje = 'Error al cargar tarea: ' + (err?.message || err);
				this.isLoading = false;
			}
		);
	}
	
	cargarFormFields(): void {
		this.procesoService.obtenerFormFields(this.tareaId).subscribe(
			(fields: any[]) => {
				this.formFields = fields;
				fields.forEach((field: any) => {
					this.formData[field.id] = field.defaultValue || '';
				});
			},
			(err: any) => {
				this.errorMensaje = 'Error al cargar campos de formulario: ' + (err?.message || err);
			}
		);
	}
	
	onCompletarTarea(): void {
		this.isLoading = false;
		this.procesoService.completarTarea(this.tareaId, this.formData).subscribe(
			() => {
				console.log('¡Suscripción exitosa! Voy a mostrar mensaje y redirigir');
				this.mensaje = 'Tarea completada correctamente';
				setTimeout(() => {
					this.router.navigate(['/']);
				}, 1500);
			},
			(err: any) => {
				this.isLoading = false;
				this.errorMensaje = 'Error al completar tarea: ' + (err?.message || err);
				console.error('Error al completar tarea:', err);
			}
		);
	}
	
	completar() {
		
		let algunInvalido = false;
		this.formulariosDinamicos.forEach((formDin, idx) => {
			formDin.formulario.markAllAsTouched();
			if (formDin.formulario.invalid) {
				alert(`Falta completar el formulario "${this.formularios[idx]?.nombre || ''}"`);
				algunInvalido = true;
			}
		});
		if (algunInvalido) return;
		
		// Recopila todas las respuestas y envía
		const tareaIdCamunda = this.route.snapshot.paramMap.get('id');
		const usuario = 'admin'; // O el usuario autenticado de la sesión
		
		this.formulariosDinamicos.forEach((formDin, idx) => {
			const  payload = {
				formularioId: this.formularios[idx].id,
				tareaIdCamunda,
				usuario,
				valores: formDin.formulario.value
			};
			this.procesoService.guardarRegistroFormulario(payload).subscribe({
				next: () => {
					alert('Formularios guardados exitosamente');
					//this.onCompletarTarea(payload);
					this.isLoading = false;
					this.procesoService.completarTarea(this.tareaId, payload).subscribe(
						() => {
							console.log('¡Suscripción exitosa! Voy a mostrar mensaje y redirigir');
							this.mensaje = 'Tarea completada correctamente';
							setTimeout(() => {
								this.router.navigate(['/']);
							}, 1500);
						},
						(err: any) => {
							this.isLoading = false;
							this.errorMensaje = 'Error al completar tarea: ' + (err?.message || err);
							console.error('Error al completar tarea:', err);
						}
					);
				},
				error: err => {
					alert(`Error guardando formulario "${this.formularios[idx]?.nombre || ''}"`);
				}
			});
		});
		
		
	}
	
	
	onLiberarTarea(): void {
		this.isLoading = true;
		this.releaseMessage = '';
		this.releaseError = '';
		this.procesoService.liberarTarea(this.tareaId).subscribe(
			() => {
				this.isLoading = false;
				this.releaseMessage = 'Tarea liberada correctamente';
				this.router.navigate(['/bandeja-tareas']);
			},
			(err: any) => {
				this.isLoading = false;
				this.releaseError = 'Error al liberar tarea: ' + (err?.message || err);
			}
		);
	}
	
	onVolver(): void{
		this.router.navigate(['/bandeja-tareas']);  
	}
	
}






