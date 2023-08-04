import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OudhAccordGoldComponent } from './oudh-accord-gold.component';

describe('OudhAccordGoldComponent', () => {
  let component: OudhAccordGoldComponent;
  let fixture: ComponentFixture<OudhAccordGoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OudhAccordGoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OudhAccordGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
