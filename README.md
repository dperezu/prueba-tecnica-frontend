# Gestión de Solicitudes TI - Frontend

Aplicación Angular para gestionar solicitudes de soporte técnico (técnicos, tipos de servicio y solicitudes).

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

Esto ejecuta `ng serve` y expone la aplicación en `http://localhost:4200`. La aplicación espera que el backend (Express + SQLite) esté corriendo en `http://localhost:3000` (ver `src/environments/environment*.ts` para la URL base de la API, `environment.apiUrl`).

## Estructura de carpetas

```
src/app/
  core/
    models/         Interfaces TypeScript que reflejan el contrato de la API (Tecnico, TipoServicio, Solicitud, envolturas de respuesta).
    services/        Servicios HttpClient para cada entidad (CRUD), mas los servicios transversales de loading y notificaciones.
    interceptors/    Interceptores HTTP funcionales: uno gestiona el indicador de carga global, el otro centraliza el manejo de errores y los toasts.
  shared/
    components/      Componentes reutilizables sin lógica de negocio específica: barra de progreso de carga y diálogo de confirmación genérico.
  features/
    solicitudes/     Pantalla principal (listado con filtros/búsqueda) y el diálogo de formulario de alta/edición de solicitudes.
```

## Decisiones técnicas

- **Componentes standalone + signals**: se evita el boilerplate de NgModules; el estado de la UI (listas cargadas, indicador de carga, formularios) se maneja con signals, que es el enfoque idiomático actual de Angular y simplifica la detección de cambios.
- **Angular Material**: se usa para las piezas de UI estándar (tabla, diálogos, snackbar, barra de progreso, campos de formulario) en lugar de construirlas a mano, priorizando accesibilidad y velocidad de desarrollo sin sacrificar consistencia visual.
- **Interceptores para loading y errores**: un interceptor incrementa/decrementa un contador de peticiones en curso (mostrando una barra de progreso global) y otro captura cualquier error HTTP para mostrar un toast con el mensaje del backend. Esto mantiene los componentes libres de try/catch repetitivo y de lógica manual para mostrar/ocultar spinners; cada componente solo necesita reaccionar cuando le interesa (por ejemplo, mantener abierto un diálogo si la petición falló).
