import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampoFormularioService } from './campo-formulario.service';
import { CampoFormulario } from './campo-formulario.model';

@Component({
  selector: 'campos-formulario-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class camposFormularioList implements OnInit {
  @Input() formularioId!: number;
  campos: CampoFormulario[] = [];
  loading = true;
  error: string | null = null;

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
}
