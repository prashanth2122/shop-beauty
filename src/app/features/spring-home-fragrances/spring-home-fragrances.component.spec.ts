import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpringHomeFragrancesComponent } from './spring-home-fragrances.component';

describe('SpringHomeFragrancesComponent', () => {
  let component: SpringHomeFragrancesComponent;
  let fixture: ComponentFixture<SpringHomeFragrancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpringHomeFragrancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpringHomeFragrancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
