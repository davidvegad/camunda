import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProcesoVariablesService {
  constructor(private http: HttpClient) {}

  getVariables(processInstanceId: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(
      `${environment.bpmnApiUrl}/api/proceso/variables?processInstanceId=${processInstanceId}`
    );
  }
}