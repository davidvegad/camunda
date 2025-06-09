/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../services/proceso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bandeja-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bandeja-tareas.html',
})
export class BandejaTareasComponent implements OnInit {
  tareas: any[] = [];
  paginaActual: number = 1;
  tamanoPagina: number = 10;
  totalPaginas: number = 1;

  constructor(private procesoService: ProcesoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.procesoService.obtenerTareasDetalladas(this.paginaActual, this.tamanoPagina).subscribe(
      (data: any) => {
        this.tareas = data.content;
        this.totalPaginas = data.totalPages;
      },
      (error: any) => {
        console.error('Error al cargar tareas:', error);
      }
    );
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarTareas();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarTareas();
    }
  }

  actualizarPaginacion(): void {
    this.paginaActual = 1;
    this.cargarTareas();
  }

  verTarea(tarea: any): void {
  // Reclama la tarea para "admin", luego navega al detalle
  this.procesoService.reclamarTarea(tarea.id, 'admin').subscribe({
    next: () => {
      this.router.navigate(['/task-detail', tarea.id]);
    },
    error: (err: any) => {
      // Si ya está asignada, igual navega al detalle
      if (err.status === 409) {
        // 409 es "Ya asignada"
        this.router.navigate(['/task-detail', tarea.id]);
      } else {
        window.alert('No se pudo reclamar la tarea: ' + (err?.error || err.message || err));
      }
    }
  });
}

}*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../services/proceso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bandeja-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bandeja-tareas.html',
})
export class BandejaTareasComponent implements OnInit {
  tareas: any[] = [];
  paginaActual: number = 1;
  tamanoPagina: number = 10;
  totalPaginas: number = 1;

  // Filtros
  filtroProceso: string = '';
  filtroBusinessKey: string = '';
  filtroFechaCreacion: string = '';
  usuario: string = 'admin'; // O el usuario autenticado

  constructor(private procesoService: ProcesoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    const filtros = {
      procesoNombre: this.filtroProceso,
      businessKey: this.filtroBusinessKey,
      fechaCreacion: this.filtroFechaCreacion,
      usuario: this.usuario
    };
    this.procesoService.obtenerTareasDetalladas(this.paginaActual, this.tamanoPagina, filtros).subscribe(
      (data: any) => {
        this.tareas = data.content;
        this.totalPaginas = data.totalPages;
      },
      (error: any) => {
        console.error('Error al cargar tareas:', error);
      }
    );
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarTareas();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.cargarTareas();
    }
  }

  actualizarPaginacion(): void {
    this.paginaActual = 1;
    this.cargarTareas();
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.cargarTareas();
  }

  limpiarFiltros(): void {
    this.filtroProceso = '';
    this.filtroBusinessKey = '';
    this.filtroFechaCreacion = '';
    this.paginaActual = 1;
    this.cargarTareas();
  }

  verTarea(tarea: any): void {
    this.procesoService.reclamarTarea(tarea.id, this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/task-detail', tarea.id]);
      },
      error: (err: any) => {
        if (err.status === 409) {
          this.router.navigate(['/task-detail', tarea.id]);
        } else {
          window.alert('No se pudo reclamar la tarea: ' + (err?.error || err.message || err));
        }
      }
    });
  }
}

