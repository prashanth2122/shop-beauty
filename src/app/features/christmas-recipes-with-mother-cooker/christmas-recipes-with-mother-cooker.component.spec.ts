import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChristmasRecipesWithMotherCookerComponent } from './christmas-recipes-with-mother-cooker.component';

describe('ChristmasRecipesWithMotherCookerComponent', () => {
  let component: ChristmasRecipesWithMotherCookerComponent;
  let fixture: ComponentFixture<ChristmasRecipesWithMotherCookerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChristmasRecipesWithMotherCookerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChristmasRecipesWithMotherCookerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
