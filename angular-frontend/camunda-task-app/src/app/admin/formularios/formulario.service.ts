import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formulario } from './formulario.model';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class FormularioService {
	// Usa la URL completa de tu backend
	private apiUrl = `${environment.bpmnApiUrl}/api/formularios`;
	
	
	constructor(private http: HttpClient) {}
	
	/** Obtener todos los formularios */
	getFormularios(): Observable<Formulario[]> {
		return this.http.get<Formulario[]>(this.apiUrl);
	}
	
	/** Obtener un formulario por ID */
	getFormulario(id: number): Observable<Formulario> {
		return this.http.get<Formulario>(`${this.apiUrl}/${id}`);
	}
	
	/** Crear un nuevo formulario */
	createFormulario(data: Formulario): Observable<Formulario> {
		return this.http.post<Formulario>(this.apiUrl, data);
	}
	
	/** Actualizar un formulario existente */
	updateFormulario(id: number, data: Formulario): Observable<Formulario> {
		return this.http.put<Formulario>(`${this.apiUrl}/${id}`, data);
	}
	
	/** Eliminar un formulario */
	deleteFormulario(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
	/*
	getTareasDeFormularioPorTarea(procesoKey: string, taskDefinitionKey: string): Observable<TareaFormulario[]> {
		return this.http.get<TareaFormulario[]>(`${this.apiUrl}?procesoKey=${procesoKey}&taskDefinitionKey=${taskDefinitionKey}`);
	}
	*/
}