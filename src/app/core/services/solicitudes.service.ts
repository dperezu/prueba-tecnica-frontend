import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiListResponse, ApiSingleResponse } from '../models/api-response.model';
import { Solicitud, SolicitudFilters, SolicitudPayload } from '../models/solicitud.model';

export interface SolicitudesResult {
  data: Solicitud[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/solicitudes`;

  getAll(filters?: SolicitudFilters): Observable<SolicitudesResult> {
    let params = new HttpParams();
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      }
    }
    return this.http
      .get<ApiListResponse<Solicitud>>(this.baseUrl, { params })
      .pipe(map((res) => ({ data: res.data, total: res.meta.total })));
  }

  getById(id: number): Observable<Solicitud> {
    return this.http
      .get<ApiSingleResponse<Solicitud>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  create(payload: SolicitudPayload): Observable<Solicitud> {
    return this.http
      .post<ApiSingleResponse<Solicitud>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  update(id: number, payload: Partial<SolicitudPayload>): Observable<Solicitud> {
    return this.http
      .put<ApiSingleResponse<Solicitud>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((res) => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
