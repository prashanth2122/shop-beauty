import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoltonBrownHistoryComponent } from './molton-brown-history.component';

describe('MoltonBrownHistoryComponent', () => {
  let component: MoltonBrownHistoryComponent;
  let fixture: ComponentFixture<MoltonBrownHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoltonBrownHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoltonBrownHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
