import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessService } from './process.service';
import { PalabraClaveService } from './palabra-clave.service';
import { Proceso } from './process.model';

import { CampoObligatorioAdmin } from './campo-obligatorio-admin/campo-obligatorio-admin';


@Component({
	selector: 'process-admin',
	standalone: true,
	imports: [CommonModule, FormsModule,CampoObligatorioAdmin],  // <-- AGREGA ESTO
	templateUrl: './process-admin.html',
	styleUrls: ['./process-admin.css']
})

export class ProcessAdmin implements OnInit {
	procesos: any[] = [];
	palabras: string[] = [];
	procesoActual = {
		id: undefined,
		nombre: '',
		processKey: '',
		descripcion: '',
		palabrasClave: [] as string[]
	};
	palabraNueva = '';
	mensaje = '';
    // En tu componente
	palabrasClave: string[] = [];
	nuevaPalabra: string = '';
	
	constructor(
		private processService: ProcessService,
		private palabraService: PalabraClaveService
	) {}
	
	ngOnInit() {
		this.cargar();
	}
	
	cargar() {
		this.processService.getAll().subscribe(ps => this.procesos = ps);
		//this.palabraService.getAll().subscribe(ws => this.palabras = ws); // ws debe ser string[]
	}
	
	seleccionar(proceso: any) {
		this.procesoActual = { ...proceso, palabrasClave: [...proceso.palabrasClave] };
	}
	
	limpiar() {
		this.procesoActual = { id: undefined, nombre: '', processKey: '', descripcion: '', palabrasClave: [] };
		this.mensaje = '';
	}
	
	guardar() {
		if (this.procesoActual.id) {
			this.processService.update(this.procesoActual.id, this.procesoActual).subscribe(() => {
				this.mensaje = 'Actualizado';
				this.cargar();
				this.limpiar();
			});
			} else {
			this.processService.create(this.procesoActual).subscribe(() => {
				this.mensaje = 'Creado';
				this.cargar();
				this.limpiar();
			});
		}
	}
	
	eliminarProceso(id: number) {
		if (confirm('¿Eliminar proceso?')) {
			this.processService.delete(id).subscribe(() => {
				this.mensaje = 'Eliminado';
				this.cargar();
			});
		}
	}
	
	agregarPalabraClaveSeleccionada(event: Event) {
		const select = event.target as HTMLSelectElement;
		const value = select.value;
		if (value && !this.procesoActual.palabrasClave.includes(value)) {
			this.procesoActual.palabrasClave.push(value);
		}
		select.selectedIndex = 0;
	}
	
	quitarPalabraClave(palabra: string) {
		this.procesoActual.palabrasClave = this.procesoActual.palabrasClave.filter(p => p !== palabra);
	}
	
	
	agregarPalabraClave() {
		const palabra = this.nuevaPalabra.trim();
		if (palabra && !this.procesoActual.palabrasClave.includes(palabra)) {
			this.procesoActual.palabrasClave.push(palabra);
		}
		this.nuevaPalabra = '';
	}
	
	
	
}