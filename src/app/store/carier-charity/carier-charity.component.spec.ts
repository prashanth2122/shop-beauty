import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarierCharityComponent } from './carier-charity.component';

describe('CarierCharityComponent', () => {
  let component: CarierCharityComponent;
  let fixture: ComponentFixture<CarierCharityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarierCharityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarierCharityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
