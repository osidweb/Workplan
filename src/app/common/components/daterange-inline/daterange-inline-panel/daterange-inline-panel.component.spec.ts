import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaterangeInlinePanelComponent } from './daterange-inline-panel.component';

describe('DaterangeInlinePanelComponent', () => {
  let component: DaterangeInlinePanelComponent;
  let fixture: ComponentFixture<DaterangeInlinePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaterangeInlinePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaterangeInlinePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
