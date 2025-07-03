import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from './tarea.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private apiUrl = `${environment.bpmnApiUrl}/api/tareas-bpmn`; // Ajusta según backend

  constructor(private http: HttpClient) {}

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }
}