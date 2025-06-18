import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PalabraClaveService {
	private baseUrl = 'http://localhost:8080/api/palabraclave'; // Ajusta si usas otro endpoint
	
	constructor(private http: HttpClient) {}
	
	getAll(): Observable<string[]> {
		return this.http.get<string[]>(this.baseUrl);
	}
	
	
	create(palabra: string): Observable<string> {
		return this.http.post<string>(this.baseUrl, palabra);
	}
	
	delete(palabra: string): Observable<void> {
		return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(palabra)}`);
	}
	
}
