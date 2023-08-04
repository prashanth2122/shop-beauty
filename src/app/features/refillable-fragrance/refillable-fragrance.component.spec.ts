import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefillableFragranceComponent } from './refillable-fragrance.component';

describe('RefillableFragranceComponent', () => {
  let component: RefillableFragranceComponent;
  let fixture: ComponentFixture<RefillableFragranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefillableFragranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefillableFragranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
