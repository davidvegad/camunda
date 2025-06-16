import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampoFormularioService } from './campo-formulario.service';
import { CampoFormulario } from './campo-formulario.model';

@Component({
  selector: 'campos-formulario-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class camposFormularioList implements OnInit {
  @Input() formularioId!: number;
  campos: CampoFormulario[] = [];
  loading = true;
  error: string | null = null;

  // --- NUEVO PARA AGREGAR ---
  showModalAgregar = false;
  camposDisponibles: CampoFormulario[] = [];
  agregarError: string | null = null;

  // Estado del form modal
  campoId: number | null = null;
  orden: number = 1;
  requerido: boolean = false;
  visible: boolean = true;
  valorPorDefecto: string = '';

  constructor(private campoFormularioService: CampoFormularioService) {}

  ngOnInit() {
    if (this.formularioId) {
      this.cargar();
    }
  }

  cargar() {
    this.loading = true;
    this.campoFormularioService.getCamposDeFormulario(this.formularioId).subscribe({
      next: data => {
        this.campos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los campos del formulario';
        this.loading = false;
      }
    });
  }

  eliminarCampo(id: number) {
    if (confirm('¿Seguro que deseas quitar este campo del formulario?')) {
      this.campoFormularioService.deleteCampoDeFormulario(id).subscribe(() => {
        this.cargar();
      });
    }
  }

  // --- MÉTODO trackById ---
  trackById(index: number, campo: CampoFormulario): number | undefined {
    return campo.id;
  }

  // --- NUEVOS MÉTODOS para agregar campo ---
  abrirAgregarCampo() {
    this.agregarError = null;
    this.showModalAgregar = true;
    // Inicializar valores
    this.campoId = null;
    this.orden = this.campos.length + 1;
    this.requerido = false;
    this.visible = true;
    this.valorPorDefecto = '';
    // Traer campos disponibles
    this.campoFormularioService.getCamposDisponibles(this.formularioId).subscribe({
      next: data => this.camposDisponibles = data,
      error: () => this.agregarError = 'No se pudo cargar la lista de campos'
    });
  }

  cerrarAgregarCampo() {
    this.showModalAgregar = false;
    this.campoId = null;
    this.orden = this.campos.length + 1;
    this.requerido = false;
    this.visible = true;
    this.valorPorDefecto = '';
    this.agregarError = null;
  }

  agregarCampoAlFormulario() {
    this.agregarError = null;
    if (!this.campoId) {
      this.agregarError = 'Selecciona un campo';
      return;
    }
    const dto: any = {
      formularioId: this.formularioId,
      campoId: this.campoId,
      orden: this.orden,
      requerido: this.requerido,
      visible: this.visible,
      valorPorDefecto: this.valorPorDefecto
    };
    this.campoFormularioService.asociarCampoAFormulario(dto).subscribe({
      next: () => {
        this.cerrarAgregarCampo();
        this.cargar();
      },
      error: () => this.agregarError = 'No se pudo agregar el campo'
    });
  }
}
