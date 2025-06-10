import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../../core/services/proceso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bandeja-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./bandeja-tareas.css'],
  templateUrl: './bandeja-tareas.html',
})
export class BandejaTareasComponent implements OnInit {
  tareas: any[] = [];
  // Otros
  paginaActual = 1;
  size = 10;
  totalPaginas = 1;
  totalElementos = 0;
  
  usuario: string = 'admin'; // o asigna el valor real desde tu lógica de login

  
  // Filtros para pestañas
  filtroActivo: 'proceso' | 'tarea' = 'proceso';

  // Proceso
  filtroProceso: string = '';
  filtroBusinessKey: string = '';
  filtroProcFechaDesde: string = '';
  filtroProcFechaHasta: string = '';

  // Tarea
  filtroTareaNombre: string = '';
  filtroTareaEstado: string = '';
  filtroTareaPeriodo: string = '';
  filtroTareaFechaDesde: string = '';
  filtroTareaFechaHasta: string = '';
  filtroTareaUsuario: string = '';
  
  listaProcesos: any[] = [];
  
  constructor(private procesoService: ProcesoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarTareas();
	this.cargarProcesosDisponibles();
  }
  


  cargarTareas(): void {
     let filtros: any = {};
	if (this.filtroActivo === 'proceso') {
      filtros.procesoNombre = this.filtroProceso;
      filtros.businessKey = this.filtroBusinessKey;
      filtros.fechaDesdeProceso = this.filtroProcFechaDesde;
      filtros.fechaHastaProceso = this.filtroProcFechaHasta;
    }

    if (this.filtroActivo === 'tarea') {
      filtros.tareaNombre = this.filtroTareaNombre;
      filtros.estado = this.filtroTareaEstado;
      filtros.periodo = this.filtroTareaPeriodo;
      filtros.fechaDesdeTarea = this.filtroTareaFechaDesde;
      filtros.fechaHastaTarea = this.filtroTareaFechaHasta;
      filtros.usuarioAceptado = this.filtroTareaUsuario;
    }
	
	
	 // Si quieres enviar usuario global:
     filtros.usuario = this.usuario;
	
    this.procesoService.obtenerTareasDetalladasAvanzado(this.paginaActual, this.size, filtros)
      .subscribe(resp => {
        this.tareas = resp.content;
        this.totalPaginas = resp.totalPages;
        this.totalElementos = resp.totalElements;
      });
  }
  
  cargarProcesosDisponibles() {
  this.procesoService.listarProcesosDisponibles().subscribe(procesos => {
    this.listaProcesos = procesos;
  });
}

  limpiarFiltros() {
    // Limpia todos los filtros
    this.filtroProceso = '';
    this.filtroBusinessKey = '';
    this.filtroProcFechaDesde = '';
    this.filtroProcFechaHasta = '';
    this.filtroTareaNombre = '';
    this.filtroTareaEstado = '';
    this.filtroTareaPeriodo = '';
    this.filtroTareaFechaDesde = '';
    this.filtroTareaFechaHasta = '';
    this.filtroTareaUsuario = '';
	
	this.actualizarPaginacion();
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
  

cambiarPagina(nuevaPagina: number) {
  this.paginaActual = nuevaPagina;
  this.aplicarFiltros(); // Vuelve a pedir datos para la página seleccionada.
}



  verTarea(tarea: any): void {
	  //this.verDetalle(tarea);
	  this.procesoService.obtenerTareaDetalle(tarea.id).subscribe(detalle => {
      const procesoKey = detalle.processDefinitionKey;
      const taskDefinitionKey = detalle.taskDefinitionKey;
	  this.procesoService.reclamarTarea(tarea.id, this.usuario).subscribe({
      next: () => {
		  this.router.navigate(['/task-detail', tarea.id,procesoKey,taskDefinitionKey]);
	      console.log('Ver detalle:', tarea);     
      },
      error: (err: any) => {
        if (err.status === 409) {
          this.router.navigate(['/task-detail', tarea.id,procesoKey,taskDefinitionKey]);
        } else {
          window.alert('No se pudo reclamar la tarea: ' + (err?.error || err.message || err));
        }
      }
    });
	  });
	  
	  
    
  }
  
  verDetalle(tarea: any) {
  // Aquí irá la navegación o acción para ver el detalle de la tarea.
  // Por ahora, solo imprime en consola.
  /*this.procesoService.obtenerTareaDetalle(tarea.id).subscribe(detalle => {
  this.procesoKey = detalle.processDefinitionKey;
  this.taskDefinitionKey = detalle.taskDefinitionKey;

  }); */
 }
}
