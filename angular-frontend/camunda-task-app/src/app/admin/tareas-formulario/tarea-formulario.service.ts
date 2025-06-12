/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TareaFormulario } from './tarea-formulario.model';

@Injectable({ providedIn: 'root' })
export class TareaFormularioService {
  private apiUrl = 'http://localhost:8080/api/tareas-formularios'; // Ajusta si usas proxy

  constructor(private http: HttpClient) {}

  getTareasDeFormulario(formularioId: number): Observable<TareaFormulario[]> {
    return this.http.get<TareaFormulario[]>(`${this.apiUrl}?formularioId=${formularioId}`);
  }

  addTareaFormulario(dto: TareaFormulario): Observable<TareaFormulario> {
    return this.http.post<TareaFormulario>(this.apiUrl, dto);
  }

  deleteTareaFormulario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
*/