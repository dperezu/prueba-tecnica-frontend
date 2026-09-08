export type EstadoSolicitud = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
export type PrioridadSolicitud = 'baja' | 'media' | 'alta';

export interface Solicitud {
  id: number;
  titulo: string;
  descripcion?: string;
  tecnico_id: number;
  tecnico_nombre: string;
  tipo_servicio_id: number;
  tipo_servicio_nombre: string;
  estado: EstadoSolicitud;
  prioridad: PrioridadSolicitud;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface SolicitudPayload {
  titulo: string;
  descripcion?: string;
  tecnico_id: number;
  tipo_servicio_id: number;
  estado?: EstadoSolicitud;
  prioridad?: PrioridadSolicitud;
}

export interface SolicitudFilters {
  estado?: EstadoSolicitud | '';
  prioridad?: PrioridadSolicitud | '';
  tecnico_id?: number | '';
  tipo_servicio_id?: number | '';
  q?: string;
  sort?: string;
}
