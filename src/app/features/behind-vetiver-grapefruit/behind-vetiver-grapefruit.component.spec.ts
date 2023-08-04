import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindVetiverGrapefruitComponent } from './behind-vetiver-grapefruit.component';

describe('BehindVetiverGrapefruitComponent', () => {
  let component: BehindVetiverGrapefruitComponent;
  let fixture: ComponentFixture<BehindVetiverGrapefruitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindVetiverGrapefruitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindVetiverGrapefruitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
