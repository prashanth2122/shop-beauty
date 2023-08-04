import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetThePerfumersJacquesChabertComponent } from './meet-the-perfumers-jacques-chabert.component';

describe('MeetThePerfumersJacquesChabertComponent', () => {
  let component: MeetThePerfumersJacquesChabertComponent;
  let fixture: ComponentFixture<MeetThePerfumersJacquesChabertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetThePerfumersJacquesChabertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetThePerfumersJacquesChabertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
