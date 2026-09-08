import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiSingleResponse, ApiListResponse } from '../models/api-response.model';
import { Tecnico } from '../models/tecnico.model';

@Injectable({ providedIn: 'root' })
export class TecnicosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tecnicos`;

  getAll(): Observable<Tecnico[]> {
    return this.http
      .get<ApiListResponse<Tecnico>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<Tecnico> {
    return this.http
      .get<ApiSingleResponse<Tecnico>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: Partial<Tecnico>): Observable<Tecnico> {
    return this.http
      .post<ApiSingleResponse<Tecnico>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  update(id: number, payload: Partial<Tecnico>): Observable<Tecnico> {
    return this.http
      .put<ApiSingleResponse<Tecnico>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
