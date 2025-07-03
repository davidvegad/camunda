import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campo } from './campo.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CampoService {
  private apiUrl = `${environment.bpmnApiUrl}/api/campos`; // Ajusta si usas proxy o variable de entorno

  constructor(private http: HttpClient) {}

  getCampos(): Observable<Campo[]> {
    return this.http.get<Campo[]>(this.apiUrl);
  }

  getCampo(id: number): Observable<Campo> {
    return this.http.get<Campo>(`${this.apiUrl}/${id}`);
  }

  createCampo(data: Campo): Observable<Campo> {
    return this.http.post<Campo>(this.apiUrl, data);
  }

  updateCampo(id: number, data: Campo): Observable<Campo> {
    return this.http.put<Campo>(`${this.apiUrl}/${id}`, data);
  }

  deleteCampo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}