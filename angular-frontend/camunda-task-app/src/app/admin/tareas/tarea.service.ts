import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from './tarea.model';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private apiUrl = 'http://localhost:8080/api/tareas-bpmn'; // Ajusta según backend

  constructor(private http: HttpClient) {}

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }
}
