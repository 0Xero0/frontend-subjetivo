import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeCounter = 0;
  private readonly _loading$ = new BehaviorSubject<boolean>(false);

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  /** Increment active operations count and emit loading=true */
  start(): void {
    this.activeCounter++;
    if (!this._loading$.value) {
      this._loading$.next(true);
    }
  }

  /** Decrement active operations count and emit loading=false when it reaches zero */
  stop(): void {
    if (this.activeCounter > 0) {
      this.activeCounter--;
    }
    if (this.activeCounter === 0 && this._loading$.value) {
      this._loading$.next(false);
    }
  }

  /** Force hide (safety) */
  reset(): void {
    this.activeCounter = 0;
    this._loading$.next(false);
  }
}
