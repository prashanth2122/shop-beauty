import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutumnHomeFragrancesComponent } from './autumn-home-fragrances.component';

describe('AutumnHomeFragrancesComponent', () => {
  let component: AutumnHomeFragrancesComponent;
  let fixture: ComponentFixture<AutumnHomeFragrancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutumnHomeFragrancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutumnHomeFragrancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
