import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplanRowMobileComponent } from './workplan-row-mobile.component';

describe('WorkplanRowMobileComponent', () => {
  let component: WorkplanRowMobileComponent;
  let fixture: ComponentFixture<WorkplanRowMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplanRowMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplanRowMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
