import { Injectable, Injector, ElementRef, ComponentRef } from '@angular/core';
import { OverlayRef, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import * as moment from 'moment';

import { DaterangeInlineRef } from './daterange-inline-ref';
import { DaterangeInlinePanelComponent } from './daterange-inline-panel/daterange-inline-panel.component';
import { DATERANGE_INLINE_PANEL_DATA } from './daterange-inline.tokens';

export interface IDaterangeInlinePanelData {
  overlayOrigin: any;
  // causeList: DictionaryRecord[];
  // cause: string | null;
  editDate: {
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
  };
  // editing: boolean;
}

interface DaterangeInlinePanelConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  positionStrategy?: any;
  data?: IDaterangeInlinePanelData;
}

@Injectable({
  providedIn: 'root'
})
export class DaterangeInlineService {
  overlayRef: OverlayRef;

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  open(origin: ElementRef, data: DaterangeInlinePanelConfig = {}): DaterangeInlineRef {
    const strategy = this.getPositionStrategy(origin);

    const DEFAULT_CONFIG: DaterangeInlinePanelConfig = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'daterange-inline-overlay-panel',
      positionStrategy: strategy,
      data: null
    };

    const dialogConfig = { ...DEFAULT_CONFIG, ...data };

    this.overlayRef = this.overlay.create(dialogConfig);

    // Instantiate remote control
    const dialogRef = new DaterangeInlineRef(this.overlayRef);

    const overlayComponent = this.attachDialogContainer(this.overlayRef, dialogConfig, dialogRef);

    dialogRef.componentInstance = overlayComponent;

    this.overlayRef.backdropClick().subscribe(() => dialogRef.close());

    return dialogRef;
  }

  updatePosition(origin: ElementRef): void {
    const strategy = this.getPositionStrategy(origin);

    this.overlayRef.updatePositionStrategy(strategy);
    this.overlayRef.updatePosition();
  }



  private getPositionStrategy(origin: ElementRef): PositionStrategy {
    return this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPush(true)
      .withViewportMargin(10)
      .withPositions([{
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
      }]);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: DaterangeInlinePanelConfig, dialogRef: DaterangeInlineRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(DaterangeInlinePanelComponent, null, injector);
    const containerRef: ComponentRef<DaterangeInlinePanelComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: DaterangeInlinePanelConfig, dialogRef: DaterangeInlineRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(DaterangeInlineRef, dialogRef);
    injectionTokens.set(DATERANGE_INLINE_PANEL_DATA, config.data);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
