/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TareaFormularioService } from '../tareas-formulario/tarea-formulario.service';
import { FormularioService } from '../formularios/formulario.service';
import { TareaFormulario } from '../tareas-formulario/tarea-formulario.model';
import { Formulario } from '../formularios/formulario.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin-tareas-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class edit implements OnInit {
  procesoKey = '';
  taskDefinitionKey = '';
  formularios: Formulario[] = [];
  tareasFormularios: TareaFormulario[] = [];
  formularioIdSeleccionado?: number;
  ordenTab = 1;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tareaFormularioService: TareaFormularioService,
    private formularioService: FormularioService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.procesoKey = params.get('procesoKey') || '';
      this.taskDefinitionKey = params.get('taskDefinitionKey') || '';
      this.cargarFormularios();
      this.cargarTareasFormularios();
    });
  }

  cargarFormularios() {
    this.formularioService.getFormularios().subscribe({
      next: data => this.formularios = data,
      error: () => this.error = 'No se pudieron cargar los formularios'
    });
  }

  cargarTareasFormularios() {
    this.loading = true;
    // Consulta todos los TareaFormulario de esta tarea
    this.tareaFormularioService.getTareasDeFormularioPorTarea(this.procesoKey, this.taskDefinitionKey)
      .subscribe({
        next: data => {
          this.tareasFormularios = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar las asociaciones';
          this.loading = false;
        }
      });
  }

  asociar() {
    if (!this.formularioIdSeleccionado) {
      alert('Selecciona un formulario');
      return;
    }
    const dto: TareaFormulario = {
      procesoKey: this.procesoKey,
      taskDefinitionKey: this.taskDefinitionKey,
      ordenTab: this.ordenTab,
      formularioId: this.formularioIdSeleccionado
    };
    this.tareaFormularioService.addTareaFormulario(dto).subscribe(() => {
      this.cargarTareasFormularios();
      this.formularioIdSeleccionado = undefined;
      this.ordenTab = 1;
    });
  }

  eliminar(id: number) {
    if (confirm('¿Quitar este formulario de la tarea?')) {
      this.tareaFormularioService.deleteTareaFormulario(id).subscribe(() => this.cargarTareasFormularios());
    }
  }
}
*/