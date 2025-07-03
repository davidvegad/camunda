import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesoService } from '../../../core/services/proceso';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
	
	constructor(private procesoService: ProcesoService,private http: HttpClient) {}
	
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
	
	
	textoLibre = '';
	isLoading = false;
	
	onSubmit() {
		this.mensaje = '';
		this.error = '';
		if (!this.textoLibre) return;
		this.isLoading = true;
		//this.http.post('http://localhost:4000/api/chatbot-iniciar-proceso-libre', { texto: this.textoLibre }).subscribe({
		this.http.post(`${environment.nodeApiUrl}/api/chatbot-iniciar-proceso-libre`, { texto: this.textoLibre }).subscribe({
			next: (resp: any) => {
				this.isLoading = false;
				if (resp.ok) {
					this.mensaje = `¡Proceso iniciado correctamente! ID: ${resp.processInstanceId || '(no disponible)'}`;
					this.textoLibre = '';
					} else {
					this.error = 'No se pudo iniciar el proceso.';
				}
			},
			error: (err) => {
				this.isLoading = false;
				this.error = err?.error?.error || 'Error al iniciar proceso.';
			}
		});
	}
}