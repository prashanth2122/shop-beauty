import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindRosaAbsoluteComponent } from './behind-rosa-absolute.component';

describe('BehindRosaAbsoluteComponent', () => {
  let component: BehindRosaAbsoluteComponent;
  let fixture: ComponentFixture<BehindRosaAbsoluteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindRosaAbsoluteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindRosaAbsoluteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
