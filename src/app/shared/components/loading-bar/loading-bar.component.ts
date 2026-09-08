import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-bar',
  imports: [MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loadingService.isLoading()) {
      <mat-progress-bar mode="indeterminate" class="loading-bar" />
    }
  `,
  styles: `
    .loading-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  `,
})
export class LoadingBarComponent {
  protected readonly loadingService = inject(LoadingService);
}
