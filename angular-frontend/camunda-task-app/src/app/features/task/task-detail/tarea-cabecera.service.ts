// tarea-cabecera.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TareaCabecera {
  etiqueta: string;
  nombreVariable: string;
  orden: number;
}

@Injectable({ providedIn: 'root' })
export class TareaCabeceraService {
  constructor(private http: HttpClient) {}

  getCabecera(procesoKey: string, taskDefinitionKey: string): Observable<TareaCabecera[]> {
    return this.http.get<TareaCabecera[]>(`${environment.bpmnApiUrl}/api/tarea-cabecera?procesoKey=${procesoKey}&taskDefinitionKey=${taskDefinitionKey}`);
  }
}