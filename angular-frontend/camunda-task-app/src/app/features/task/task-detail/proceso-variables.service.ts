import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProcesoVariablesService {
  constructor(private http: HttpClient) {}

  getVariables(processInstanceId: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(
      `http://localhost:8080/api/proceso/variables?processInstanceId=${processInstanceId}`
    );
  }
}
