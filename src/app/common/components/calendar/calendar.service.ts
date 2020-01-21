import { Injectable, Injector, ElementRef, ComponentRef } from '@angular/core';
import { OverlayRef, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { CalendarRef } from './calendar-ref';
import { CalendarPanelComponent } from './calendar-panel/calendar-panel.component';
import { CALENDAR_PANEL_DATA } from './calendar.tokens';
import * as moment from 'moment';

export interface ICalendarPanelData {
  overlayOrigin: any;
  selectDate: moment.Moment;
}

interface CalendarPanelConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  positionStrategy?: any;
  data?: ICalendarPanelData;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  overlayRef: OverlayRef;

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  open(origin: ElementRef, data: CalendarPanelConfig = {}): CalendarRef {
    const strategy = this.getPositionStrategy(origin);

    const DEFAULT_CONFIG: CalendarPanelConfig = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'calendar-overlay-panel',
      positionStrategy: strategy,
      data: null
    };

    const dialogConfig = { ...DEFAULT_CONFIG, ...data };

    this.overlayRef = this.overlay.create(dialogConfig);

    // Instantiate remote control
    const dialogRef = new CalendarRef(this.overlayRef);

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

  private attachDialogContainer(overlayRef: OverlayRef, config: CalendarPanelConfig, dialogRef: CalendarRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(CalendarPanelComponent, null, injector);
    const containerRef: ComponentRef<CalendarPanelComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: CalendarPanelConfig, dialogRef: CalendarRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(CalendarRef, dialogRef);
    injectionTokens.set(CALENDAR_PANEL_DATA, config.data);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
