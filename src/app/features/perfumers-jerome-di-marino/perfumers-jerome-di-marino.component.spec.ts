import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumersJeromeDiMarinoComponent } from './perfumers-jerome-di-marino.component';

describe('PerfumersJeromeDiMarinoComponent', () => {
  let component: PerfumersJeromeDiMarinoComponent;
  let fixture: ComponentFixture<PerfumersJeromeDiMarinoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfumersJeromeDiMarinoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfumersJeromeDiMarinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
