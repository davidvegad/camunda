import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../../core/services/proceso';
import { FormularioDinamicoComponent } from '../../formularios/formulario-dinamico/formulario-dinamico'; // Corrige el path

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,FormularioDinamicoComponent],
  styleUrls: ['./task-detail.css'],
  templateUrl: './task-detail.html',
})
export class TaskDetailComponent implements OnInit {
  task: any = null;
  formFields: any[] = [];
  formData: { [key: string]: any } = {};
  isLoading: boolean = false;
  errorMensaje: string = '';
  releaseMessage: string = '';
  releaseError: string = '';
  tareaId: string = '';
  mensaje : string = '';
  
  formularios: any[] = [];
  respuestas: { [id: string]: any } = {};
  pestanaActiva: number = 0;

  constructor(
    private procesoService: ProcesoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    
	this.tareaId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tareaId) {
      this.cargarDetalleTarea();
      //this.cargarFormFields();
    } else {
      this.errorMensaje = 'No se proporcionó ID de tarea.';
    }
	
	// Obtener datos de la tarea según tu navegación/routing
    const procesoKey = this.route.snapshot.paramMap.get('procesoKey')!;
    const taskDefinitionKey = this.route.snapshot.paramMap.get('taskDefinitionKey')!;
	
    this.isLoading = true;
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
  
  onFormValido(form: any, formulario: any) {
    this.respuestas[formulario.id] = form.value;
  }

  cargarDetalleTarea(): void {
    this.isLoading = true;
    this.procesoService.obtenerTareaDetalle(this.tareaId).subscribe(
      (tarea: any) => {
        this.task = tarea;
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
    // Puedes hacer validaciones aquí antes de enviar
    for (const formulario of this.formularios) {
      if (!this.respuestas[formulario.id]) {
        alert(`Falta completar el formulario "${formulario.nombre}"`);
        return;
      }
    }
    // Enviar cada formulario como registro independiente:
    const tareaIdCamunda = this.route.snapshot.paramMap.get('id');
    const usuario = 'admin'; // O el usuario autenticado de la sesión
    for (const formulario of this.formularios) {
      const payload = {
        formularioId: formulario.id,
        tareaIdCamunda: tareaIdCamunda,
        usuario,
        valores: this.respuestas[formulario.id]
      };
      this.procesoService.guardarRegistroFormulario(payload).subscribe({
        next: () => {
          // Puedes hacer algo aquí, o esperar a que todos terminen para avanzar el proceso en Camunda
        },
        error: err => {
          alert(`Error guardando formulario "${formulario.nombre}"`);
        }
      });
    }
    alert('Formularios guardados exitosamente');
    // Aquí podrías llamar al endpoint para completar la tarea Camunda
	this.onCompletarTarea();
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




