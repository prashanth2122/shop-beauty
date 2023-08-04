import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumersCarlachabertComponent } from './perfumers-carlachabert.component';

describe('PerfumersCarlachabertComponent', () => {
  let component: PerfumersCarlachabertComponent;
  let fixture: ComponentFixture<PerfumersCarlachabertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfumersCarlachabertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfumersCarlachabertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
