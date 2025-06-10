import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const backendUrl = 'http://localhost:8080/api/proceso';

@Injectable({ providedIn: 'root' })
export class ProcesoService {
  constructor(private http: HttpClient) {}

  // Bandeja
  /*obtenerTareasDetalladas(pagina: number, tamanio: number): Observable<any> {
    return this.http.get(`${backendUrl}/tareas-detalladas`, {
      params: { page: pagina, size: tamanio }
    });
  }*/
  
  obtenerTareasDetalladasAvanzado(
    pagina: number,
    tamanio: number,
    filtros: any = {}
  ): Observable<any> {
    let params: any = { page: pagina, size: tamanio };

    // Proceso
    if (filtros.procesoNombre)   params.procesoNombre = filtros.procesoNombre;
    if (filtros.businessKey)     params.businessKey = filtros.businessKey;
    if (filtros.fechaDesdeProceso) params.fechaDesdeProceso = filtros.fechaDesdeProceso;
    if (filtros.fechaHastaProceso) params.fechaHastaProceso = filtros.fechaHastaProceso;

    // Tarea
    if (filtros.fechaDesdeTarea) params.fechaDesdeTarea = filtros.fechaDesdeTarea;
    if (filtros.fechaHastaTarea) params.fechaHastaTarea = filtros.fechaHastaTarea;
    if (filtros.tareaNombre)     params.tareaNombre = filtros.tareaNombre;
    if (filtros.estado)          params.estado = filtros.estado;
    if (filtros.periodo)         params.periodo = filtros.periodo;
    if (filtros.usuarioAceptado) params.usuarioAceptado = filtros.usuarioAceptado;

    if (filtros.usuario)         params.usuario = filtros.usuario;

    return this.http.get(`${backendUrl}/tareas-detalladas`, { params });
  }



// Listar procesos disponibles
listarProcesosDisponibles(): Observable<any[]> {
  return this.http.get<any[]>(`${backendUrl}/procesos`);
}

// Iniciar proceso (solo necesita el key)
iniciarProceso(processDefinitionKey: string): Observable<string> {
  return this.http.post(`${backendUrl}/iniciar-con-businesskey/${processDefinitionKey}`, null, { responseType: 'text' });
}


  // Task detail
  obtenerTareaDetalle(id: string): Observable<any> {
    return this.http.get(`${backendUrl}/tarea/${id}`);
  }

  obtenerFormFields(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${backendUrl}/tarea/${id}/campos-formulario`);
  }

  /*completarTarea(id: string, data: any): Observable<any> {
    return this.http.post(`${backendUrl}/tarea/${id}/completar`, data);
  }*/
  
  completarTarea(id: string, data: any): Observable<any> {
  return this.http.post(`${backendUrl}/tarea/${id}/completar`, data, { responseType: 'text' });
}


liberarTarea(id: string): Observable<any> {
  return this.http.post(`${backendUrl}/tarea/${id}/liberar`, {}, { responseType: 'text' });
}


  // Puedes agregar aquí otros métodos que vayas necesitando...
  reclamarTarea(taskId: string, userId: string): Observable<any> {
  return this.http.post(
    `${backendUrl}/tarea/${taskId}/reclamar`,
    { userId },
    { responseType: 'text' }
  );
}

}
