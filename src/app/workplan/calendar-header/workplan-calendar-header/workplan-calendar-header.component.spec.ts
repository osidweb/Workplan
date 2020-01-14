import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplanCalendarHeaderComponent } from './workplan-calendar-header.component';

describe('WorkplanCalendarHeaderComponent', () => {
  let component: WorkplanCalendarHeaderComponent;
  let fixture: ComponentFixture<WorkplanCalendarHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplanCalendarHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplanCalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
