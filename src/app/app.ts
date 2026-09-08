import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingBarComponent } from './shared/components/loading-bar/loading-bar.component';
import { SolicitudesListComponent } from './features/solicitudes/solicitudes-list/solicitudes-list.component';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, LoadingBarComponent, SolicitudesListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
