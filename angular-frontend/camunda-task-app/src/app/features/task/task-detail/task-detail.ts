import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../../core/services/proceso';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(
    private procesoService: ProcesoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tareaId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tareaId) {
      this.cargarDetalleTarea();
      this.cargarFormFields();
    } else {
      this.errorMensaje = 'No se proporcionó ID de tarea.';
    }
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
}
