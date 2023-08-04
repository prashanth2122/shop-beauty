import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalTravelComponent } from './journal-travel.component';

describe('JournalTravelComponent', () => {
  let component: JournalTravelComponent;
  let fixture: ComponentFixture<JournalTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
