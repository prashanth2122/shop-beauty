import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindOrangeBergamotComponent } from './behind-orange-bergamot.component';

describe('BehindOrangeBergamotComponent', () => {
  let component: BehindOrangeBergamotComponent;
  let fixture: ComponentFixture<BehindOrangeBergamotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindOrangeBergamotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindOrangeBergamotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
