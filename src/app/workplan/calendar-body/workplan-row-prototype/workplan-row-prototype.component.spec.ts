import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplanRowPrototypeComponent } from './workplan-row-prototype.component';

describe('WorkplanRowPrototypeComponent', () => {
  let component: WorkplanRowPrototypeComponent;
  let fixture: ComponentFixture<WorkplanRowPrototypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplanRowPrototypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplanRowPrototypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
