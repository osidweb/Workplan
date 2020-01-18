import { Injectable, Injector, ElementRef, ComponentRef } from '@angular/core';
import { OverlayRef, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { AbsenceRef } from './absence/absence-ref';
import { AbsencePanelComponent } from './absence/absence-panel/absence-panel.component';
import { ABSENCE_PANEL_DATA } from './absence/absence.tokens';
import { DictionaryRecord } from '../interfaces/dictionary-record';

export interface IAbsencePanelData {
  overlayOrigin: any;
  causeList: DictionaryRecord[];
  cause: string | null;
  editDate: {
    startDate: string | null;
    endDate: string | null;
  };
  // documentUnid: string;
  // tags: ISelectedTag[];
}

interface AbsencePanelConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  positionStrategy?: any;
  data?: IAbsencePanelData;
}

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  overlayRef: OverlayRef;

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  open(origin: ElementRef, data: AbsencePanelConfig = {}): AbsenceRef {
    const strategy = this.getPositionStrategy(origin);

    const DEFAULT_CONFIG: AbsencePanelConfig = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'absence-overlay-panel',
      positionStrategy: strategy,
      data: null
    };

    const dialogConfig = { ...DEFAULT_CONFIG, ...data };

    this.overlayRef = this.overlay.create(dialogConfig);

    // Instantiate remote control
    const dialogRef = new AbsenceRef(this.overlayRef);

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

  private attachDialogContainer(overlayRef: OverlayRef, config: AbsencePanelConfig, dialogRef: AbsenceRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(AbsencePanelComponent, null, injector);
    const containerRef: ComponentRef<AbsencePanelComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: AbsencePanelConfig, dialogRef: AbsenceRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(AbsenceRef, dialogRef);
    injectionTokens.set(ABSENCE_PANEL_DATA, config.data);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
