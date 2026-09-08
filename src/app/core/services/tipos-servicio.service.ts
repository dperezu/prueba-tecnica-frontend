import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiSingleResponse, ApiListResponse } from '../models/api-response.model';
import { TipoServicio } from '../models/tipo-servicio.model';

@Injectable({ providedIn: 'root' })
export class TiposServicioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tipos-servicio`;

  getAll(): Observable<TipoServicio[]> {
    return this.http
      .get<ApiListResponse<TipoServicio>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<TipoServicio> {
    return this.http
      .get<ApiSingleResponse<TipoServicio>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: Partial<TipoServicio>): Observable<TipoServicio> {
    return this.http
      .post<ApiSingleResponse<TipoServicio>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  update(id: number, payload: Partial<TipoServicio>): Observable<TipoServicio> {
    return this.http
      .put<ApiSingleResponse<TipoServicio>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
