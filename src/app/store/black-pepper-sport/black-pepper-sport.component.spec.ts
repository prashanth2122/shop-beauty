import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackPepperSportComponent } from './black-pepper-sport.component';

describe('BlackPepperSportComponent', () => {
  let component: BlackPepperSportComponent;
  let fixture: ComponentFixture<BlackPepperSportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackPepperSportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackPepperSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
