import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensGroomingRoutineComponent } from './mens-grooming-routine.component';

describe('MensGroomingRoutineComponent', () => {
  let component: MensGroomingRoutineComponent;
  let fixture: ComponentFixture<MensGroomingRoutineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensGroomingRoutineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensGroomingRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
