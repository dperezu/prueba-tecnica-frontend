import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap, takeUntil, tap } from 'rxjs';
import { EstadoSolicitud, PrioridadSolicitud, Solicitud } from '../../../core/models/solicitud.model';
import { Tecnico } from '../../../core/models/tecnico.model';
import { TipoServicio } from '../../../core/models/tipo-servicio.model';
import { NotificationService } from '../../../core/services/notification.service';
import { SolicitudesService } from '../../../core/services/solicitudes.service';
import { TecnicosService } from '../../../core/services/tecnicos.service';
import { TiposServicioService } from '../../../core/services/tipos-servicio.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SolicitudFormDialogComponent } from '../solicitud-form-dialog/solicitud-form-dialog.component';

const ESTADO_OPTIONS: { value: EstadoSolicitud; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
];

const PRIORIDAD_OPTIONS: { value: PrioridadSolicitud; label: string }[] = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
];

const ESTADO_CHIP_CLASS: Record<EstadoSolicitud, string> = {
  pendiente: 'chip-pendiente',
  en_progreso: 'chip-en-progreso',
  completada: 'chip-completada',
  cancelada: 'chip-cancelada',
};

const ESTADO_LABEL: Record<EstadoSolicitud, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

@Component({
  selector: 'app-solicitudes-list',
  imports: [
    FormsModule,
    DatePipe,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './solicitudes-list.component.html',
  styleUrl: './solicitudes-list.component.scss',
})
export class SolicitudesListComponent implements OnInit, OnDestroy {
  private readonly solicitudesService = inject(SolicitudesService);
  private readonly tecnicosService = inject(TecnicosService);
  private readonly tiposServicioService = inject(TiposServicioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  protected readonly columns = [
    'titulo',
    'tecnico_nombre',
    'tipo_servicio_nombre',
    'estado',
    'prioridad',
    'fecha_creacion',
    'acciones',
  ];

  protected readonly estadoOptions = ESTADO_OPTIONS;
  protected readonly prioridadOptions = PRIORIDAD_OPTIONS;

  protected estadoLabel(estado: EstadoSolicitud): string {
    return ESTADO_LABEL[estado];
  }

  protected estadoChipClass(estado: EstadoSolicitud): string {
    return ESTADO_CHIP_CLASS[estado];
  }

  protected readonly solicitudes = signal<Solicitud[]>([]);
  protected readonly tecnicos = signal<Tecnico[]>([]);
  protected readonly tiposServicio = signal<TipoServicio[]>([]);

  protected searchTerm = '';
  protected estadoFiltro: EstadoSolicitud | '' = '';
  protected prioridadFiltro: PrioridadSolicitud | '' = '';
  protected tecnicoFiltro: number | '' = '';

  ngOnInit(): void {
    this.tecnicosService
      .getAll()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of([])),
      )
      .subscribe((tecnicos) => this.tecnicos.set(tecnicos));

    this.tiposServicioService
      .getAll()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of([])),
      )
      .subscribe((tiposServicio) => this.tiposServicio.set(tiposServicio));

    this.search$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(() => this.fetchSolicitudes()),
      )
      .subscribe();

    this.reload();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onSearchChange(value: string): void {
    this.searchTerm = value;
    this.search$.next(value);
  }

  protected onFilterChange(): void {
    this.reload();
  }

  protected limpiarFiltros(): void {
    this.searchTerm = '';
    this.estadoFiltro = '';
    this.prioridadFiltro = '';
    this.tecnicoFiltro = '';
    this.reload();
  }

  protected reload(): void {
    this.fetchSolicitudes()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private fetchSolicitudes() {
    return this.solicitudesService
      .getAll({
        q: this.searchTerm || undefined,
        estado: this.estadoFiltro || undefined,
        prioridad: this.prioridadFiltro || undefined,
        tecnico_id: this.tecnicoFiltro || undefined,
      })
      .pipe(
        tap((result) => this.solicitudes.set(result.data)),
        catchError(() => of({ data: [] as Solicitud[], total: 0 })),
      );
  }

  protected openCreateDialog(): void {
    const dialogRef = this.dialog.open(SolicitudFormDialogComponent, {
      data: { mode: 'create', tecnicos: this.tecnicos(), tiposServicio: this.tiposServicio() },
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.success('Solicitud creada correctamente');
        this.reload();
      }
    });
  }

  protected openEditDialog(solicitud: Solicitud): void {
    const dialogRef = this.dialog.open(SolicitudFormDialogComponent, {
      data: {
        mode: 'edit',
        solicitud,
        tecnicos: this.tecnicos(),
        tiposServicio: this.tiposServicio(),
      },
      width: '480px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notificationService.success('Solicitud actualizada correctamente');
        this.reload();
      }
    });
  }

  protected openDeleteDialog(solicitud: Solicitud): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar solicitud',
        message: `Se eliminará la solicitud "${solicitud.titulo}". Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.solicitudesService
        .delete(solicitud.id)
        .pipe(catchError(() => of(null)))
        .subscribe((result) => {
          if (result === null) {
            return;
          }
          this.notificationService.success('Solicitud eliminada correctamente');
          this.reload();
        });
    });
  }
}
