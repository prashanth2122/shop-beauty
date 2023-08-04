import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthyHairCareRoutineComponent } from './healthy-hair-care-routine.component';

describe('HealthyHairCareRoutineComponent', () => {
  let component: HealthyHairCareRoutineComponent;
  let fixture: ComponentFixture<HealthyHairCareRoutineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthyHairCareRoutineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthyHairCareRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
