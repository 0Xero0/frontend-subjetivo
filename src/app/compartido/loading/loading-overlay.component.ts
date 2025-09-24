import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingOverlayComponent {
  loading$ = this.loadingService.loading$;
  constructor(private loadingService: LoadingService) {}
}
