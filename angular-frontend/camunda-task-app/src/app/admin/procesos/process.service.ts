import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proceso } from './process.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProcessService {
  private baseUrl = `${environment.bpmnApiUrl}/api/reglaprocesos`; // Ajusta si usas otro endpoint

  constructor(private http: HttpClient) {}

  getAll(): Observable<Proceso[]> {
    return this.http.get<Proceso[]>(this.baseUrl);
  }

  getById(id: number): Observable<Proceso> {
    return this.http.get<Proceso>(`${this.baseUrl}/${id}`);
  }

  create(proceso: Proceso): Observable<Proceso> {
    return this.http.post<Proceso>(this.baseUrl, proceso);
  }

  update(id: number, proceso: Proceso): Observable<Proceso> {
    return this.http.put<Proceso>(`${this.baseUrl}/${id}`, proceso);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}