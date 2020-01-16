import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsencePanelComponent } from './absence-panel.component';

describe('AbsencePanelComponent', () => {
  let component: AbsencePanelComponent;
  let fixture: ComponentFixture<AbsencePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsencePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsencePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
