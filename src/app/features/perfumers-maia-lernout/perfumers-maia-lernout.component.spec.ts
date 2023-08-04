import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumersMaiaLernoutComponent } from './perfumers-maia-lernout.component';

describe('PerfumersMaiaLernoutComponent', () => {
  let component: PerfumersMaiaLernoutComponent;
  let fixture: ComponentFixture<PerfumersMaiaLernoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfumersMaiaLernoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfumersMaiaLernoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
