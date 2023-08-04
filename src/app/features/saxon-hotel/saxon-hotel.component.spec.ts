import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaxonHotelComponent } from './saxon-hotel.component';

describe('SaxonHotelComponent', () => {
  let component: SaxonHotelComponent;
  let fixture: ComponentFixture<SaxonHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaxonHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaxonHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
