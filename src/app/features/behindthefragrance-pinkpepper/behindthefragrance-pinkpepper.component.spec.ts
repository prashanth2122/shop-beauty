import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindthefragrancePinkpepperComponent } from './behindthefragrance-pinkpepper.component';

describe('BehindthefragrancePinkpepperComponent', () => {
  let component: BehindthefragrancePinkpepperComponent;
  let fixture: ComponentFixture<BehindthefragrancePinkpepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindthefragrancePinkpepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindthefragrancePinkpepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
