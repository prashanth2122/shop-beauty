import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToiletteEauDeParfumComponent } from './toilette-eau-de-parfum.component';

describe('ToiletteEauDeParfumComponent', () => {
  let component: ToiletteEauDeParfumComponent;
  let fixture: ComponentFixture<ToiletteEauDeParfumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToiletteEauDeParfumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToiletteEauDeParfumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
