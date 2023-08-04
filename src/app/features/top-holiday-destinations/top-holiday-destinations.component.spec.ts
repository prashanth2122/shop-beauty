import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHolidayDestinationsComponent } from './top-holiday-destinations.component';

describe('TopHolidayDestinationsComponent', () => {
  let component: TopHolidayDestinationsComponent;
  let fixture: ComponentFixture<TopHolidayDestinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopHolidayDestinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopHolidayDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
