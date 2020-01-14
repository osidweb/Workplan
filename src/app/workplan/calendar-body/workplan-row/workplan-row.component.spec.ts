import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplanRowComponent } from './workplan-row.component';

describe('WorkplanRowComponent', () => {
  let component: WorkplanRowComponent;
  let fixture: ComponentFixture<WorkplanRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplanRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplanRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
