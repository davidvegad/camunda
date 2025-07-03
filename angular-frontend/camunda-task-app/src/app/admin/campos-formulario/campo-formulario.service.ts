import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CampoFormulario } from './campo-formulario.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CampoFormularioService {
	private apiUrl = `${environment.bpmnApiUrl}/api/formulario-campos`; // Ajusta si usas proxy
	
	constructor(private http: HttpClient) {}
	
	getCamposDeFormulario(formularioId: number): Observable<CampoFormulario[]> {
		return this.http.get<CampoFormulario[]>(`${this.apiUrl}/formulario/${formularioId}`);
	}
	
	addOrUpdateCampo(dto: CampoFormulario): Observable<CampoFormulario> {
		return this.http.post<CampoFormulario>(this.apiUrl, dto);
	}
	
	deleteCampoDeFormulario(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
	
	cambiarOrden(formularioId: number, orden: { id: number, orden: number }[]): Observable<void> {
		return this.http.put<void>(`${this.apiUrl}/formulario/${formularioId}/orden`, orden);
	}
	
	getCamposDisponibles(formularioId: number) {
		return this.http.get<CampoFormulario[]>(`${this.apiUrl}/formulario/${formularioId}/disponibles`);
	}
	asociarCampoAFormulario(dto: CampoFormulario) {
		return this.http.post<CampoFormulario>(`${this.apiUrl}`, dto);
	}
	
}