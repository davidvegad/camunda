import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE
import { TareaFormularioService } from './tarea-formulario.service';
import { TareaFormulario } from './tarea-formulario.model';

@Component({
  selector: 'tareas-formulario-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class tareasFormularioList implements OnInit {
  @Input() formularioId!: number;
  tareas: TareaFormulario[] = [];
  loading = true;
  error: string | null = null;

  // Datos para agregar nueva asociación:
  procesoKey = '';
  taskDefinitionKey = '';
  ordenTab = 1;

  constructor(private tareaFormularioService: TareaFormularioService) {}

  ngOnInit() {
    if (this.formularioId) {
      this.cargar();
    }
  }

  cargar() {
    this.loading = true;
    this.tareaFormularioService.getTareasDeFormulario(this.formularioId).subscribe({
      next: data => {
        this.tareas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las tareas asociadas';
        this.loading = false;
      }
    });
  }

  agregar() {
    if (!this.procesoKey || !this.taskDefinitionKey) {
      alert('Debes completar todos los campos');
      return;
    }
    const dto: TareaFormulario = {
      procesoKey: this.procesoKey,
      taskDefinitionKey: this.taskDefinitionKey,
      ordenTab: this.ordenTab,
      formularioId: this.formularioId
    };
    this.tareaFormularioService.addTareaFormulario(dto).subscribe({
      next: () => {
        this.procesoKey = '';
        this.taskDefinitionKey = '';
        this.ordenTab = 1;
        this.cargar();
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Quitar asociación con esta tarea?')) {
      this.tareaFormularioService.deleteTareaFormulario(id).subscribe(() => this.cargar());
    }
  }
}
