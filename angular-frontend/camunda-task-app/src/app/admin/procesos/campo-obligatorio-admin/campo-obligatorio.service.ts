import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CampoObligatorio } from './campo-obligatorio.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CampoObligatorioService {
  private baseUrl = `${environment.bpmnApiUrl}/api/campos-obligatorios`;

  constructor(private http: HttpClient) {}

  getByProcesoId(procesoId: number): Observable<CampoObligatorio[]> {
    return this.http.get<CampoObligatorio[]>(`${this.baseUrl}?procesoId=${procesoId}`);
  }

  create(campo: CampoObligatorio): Observable<CampoObligatorio> {
    return this.http.post<CampoObligatorio>(this.baseUrl, campo);
  }

  update(id: number, campo: CampoObligatorio): Observable<CampoObligatorio> {
    return this.http.put<CampoObligatorio>(`${this.baseUrl}/${id}`, campo);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}