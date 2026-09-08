import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { catchError, of } from 'rxjs';
import { EstadoSolicitud, PrioridadSolicitud, Solicitud } from '../../../core/models/solicitud.model';
import { Tecnico } from '../../../core/models/tecnico.model';
import { TipoServicio } from '../../../core/models/tipo-servicio.model';
import { SolicitudesService } from '../../../core/services/solicitudes.service';

export type SolicitudFormDialogData =
  | { mode: 'create'; tecnicos: Tecnico[]; tiposServicio: TipoServicio[] }
  | { mode: 'edit'; solicitud: Solicitud; tecnicos: Tecnico[]; tiposServicio: TipoServicio[] };

const ESTADOS: { value: EstadoSolicitud; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
];

const PRIORIDADES: { value: PrioridadSolicitud; label: string }[] = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
];

@Component({
  selector: 'app-solicitud-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitud-form-dialog.component.html',
  styleUrl: './solicitud-form-dialog.component.scss',
})
export class SolicitudFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly solicitudesService = inject(SolicitudesService);
  protected readonly dialogRef = inject(MatDialogRef<SolicitudFormDialogComponent>);
  protected readonly data = inject<SolicitudFormDialogData>(MAT_DIALOG_DATA);

  protected readonly estados = ESTADOS;
  protected readonly prioridades = PRIORIDADES;
  protected readonly isEdit = this.data.mode === 'edit';
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    titulo: [
      this.isEdit ? (this.data as { solicitud: Solicitud }).solicitud.titulo : '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(150)],
    ],
    descripcion: [
      this.isEdit ? ((this.data as { solicitud: Solicitud }).solicitud.descripcion ?? '') : '',
      [Validators.maxLength(1000)],
    ],
    tecnico_id: [
      this.isEdit ? (this.data as { solicitud: Solicitud }).solicitud.tecnico_id : (null as number | null),
      [Validators.required],
    ],
    tipo_servicio_id: [
      this.isEdit
        ? (this.data as { solicitud: Solicitud }).solicitud.tipo_servicio_id
        : (null as number | null),
      [Validators.required],
    ],
    estado: [
      this.isEdit ? (this.data as { solicitud: Solicitud }).solicitud.estado : ('pendiente' as EstadoSolicitud),
      [Validators.required],
    ],
    prioridad: [
      this.isEdit
        ? (this.data as { solicitud: Solicitud }).solicitud.prioridad
        : ('media' as PrioridadSolicitud),
      [Validators.required],
    ],
  });

  protected submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const raw = this.form.getRawValue();
    const payload = {
      titulo: raw.titulo,
      descripcion: raw.descripcion || undefined,
      tecnico_id: raw.tecnico_id as number,
      tipo_servicio_id: raw.tipo_servicio_id as number,
      estado: raw.estado,
      prioridad: raw.prioridad,
    };

    const request$ =
      this.data.mode === 'edit'
        ? this.solicitudesService.update(this.data.solicitud.id, payload)
        : this.solicitudesService.create(payload);

    request$
      .pipe(
        catchError(() => {
          this.submitting.set(false);
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.dialogRef.close(result);
        }
      });
  }
}
