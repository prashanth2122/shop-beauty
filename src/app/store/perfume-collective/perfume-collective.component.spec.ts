import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeCollectiveComponent } from './perfume-collective.component';

describe('PerfumeCollectiveComponent', () => {
  let component: PerfumeCollectiveComponent;
  let fixture: ComponentFixture<PerfumeCollectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfumeCollectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfumeCollectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
