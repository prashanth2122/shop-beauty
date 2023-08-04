import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindthefragranceBlackpepperComponent } from './behindthefragrance-blackpepper.component';

describe('BehindthefragranceBlackpepperComponent', () => {
  let component: BehindthefragranceBlackpepperComponent;
  let fixture: ComponentFixture<BehindthefragranceBlackpepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindthefragranceBlackpepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindthefragranceBlackpepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
