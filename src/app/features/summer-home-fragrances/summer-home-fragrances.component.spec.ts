import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerHomeFragrancesComponent } from './summer-home-fragrances.component';

describe('SummerHomeFragrancesComponent', () => {
  let component: SummerHomeFragrancesComponent;
  let fixture: ComponentFixture<SummerHomeFragrancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummerHomeFragrancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummerHomeFragrancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
