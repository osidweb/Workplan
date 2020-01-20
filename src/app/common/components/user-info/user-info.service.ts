import { Injectable, Injector, ElementRef, ComponentRef } from '@angular/core';
import { OverlayRef, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { WorkplanUser } from '../../interfaces/workplan-user';
import { UserInfoRef } from './user-info-ref';
import { UserInfoPanelComponent } from './user-info-panel/user-info-panel.component';
import { USER_INFO_PANEL_DATA } from './user-info.tokens';

export interface IUserInfoPanelData {
  overlayOrigin: any;
  user: WorkplanUser;
}

interface UserInfoPanelConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  positionStrategy?: any;
  data?: IUserInfoPanelData;
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  overlayRef: OverlayRef;

  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  open(origin: ElementRef, data: UserInfoPanelConfig = {}): UserInfoRef {
    const strategy = this.getPositionStrategy(origin);

    const DEFAULT_CONFIG: UserInfoPanelConfig = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'user-info-overlay-panel',
      positionStrategy: strategy,
      data: null
    };

    const dialogConfig = { ...DEFAULT_CONFIG, ...data };

    this.overlayRef = this.overlay.create(dialogConfig);

    // Instantiate remote control
    const dialogRef = new UserInfoRef(this.overlayRef);

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

  private attachDialogContainer(overlayRef: OverlayRef, config: UserInfoPanelConfig, dialogRef: UserInfoRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(UserInfoPanelComponent, null, injector);
    const containerRef: ComponentRef<UserInfoPanelComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: UserInfoPanelConfig, dialogRef: UserInfoRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(UserInfoRef, dialogRef);
    injectionTokens.set(USER_INFO_PANEL_DATA, config.data);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
