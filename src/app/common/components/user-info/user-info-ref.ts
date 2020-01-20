import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { UserInfoPanelComponent } from './user-info-panel/user-info-panel.component';

export class UserInfoRef {
  private vBeforeClosed = new Subject<void>();
  private vAfterClosed = new Subject<void>();

  componentInstance: UserInfoPanelComponent;

  constructor(
    private overlayRef: OverlayRef
  ) { }

  close(result?: any | undefined): void {
    this.componentInstance.animationStateChanged.pipe(
      filter(event => event.phaseName === 'start'),
      take(1)
    ).subscribe(() => {
      this.vBeforeClosed.next(result);
      this.vBeforeClosed.complete();
      this.overlayRef.detachBackdrop();
    });

    this.componentInstance.animationStateChanged.pipe(
      filter(event => event.phaseName === 'done' && event.toState === 'leave'),
      take(1)
    ).subscribe(() => {
      this.overlayRef.dispose();
      this.vAfterClosed.next(result);
      this.vAfterClosed.complete();

      this.componentInstance = null;
    });

    this.componentInstance.startExitAnimation();
  }

  afterClosed(): Observable<any | undefined> {
    return this.vAfterClosed.asObservable();
  }

  beforeClose(): Observable<any | undefined> {
    this.overlayRef.updatePosition();
    return this.vBeforeClosed.asObservable();
  }
}
