import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../../core/services/proceso';

@Component({
  selector: 'app-proceso-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proceso-inicio.html',
})
export class ProcesoInicioComponent implements OnInit {
  procesos: any[] = [];
  definitionKey: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(private procesoService: ProcesoService) {}

  ngOnInit(): void {
    this.cargarProcesos();
  }

  cargarProcesos(): void {
    this.procesoService.listarProcesosDisponibles().subscribe({
      next: (res: any[]) => {
        this.procesos = res;
      },
      error: (err: any) => {
        this.error = 'Error al obtener procesos: ' + (err?.message || err);
      }
    });
  }

  onIniciarProceso(): void {
    if (!this.definitionKey) {
      this.error = 'Selecciona un proceso para iniciar.';
      this.mensaje = '';
      return;
    }
    this.procesoService.iniciarProceso(this.definitionKey).subscribe({
      next: (businessKey: string) => {
        this.mensaje = `Proceso iniciado correctamente. BusinessKey: ${businessKey}`;
        this.error = '';
      },
      error: (err: any) => {
        this.mensaje = '';
        this.error = 'Error al iniciar proceso: ' + (err?.message || err);
      }
    });
  }
}
