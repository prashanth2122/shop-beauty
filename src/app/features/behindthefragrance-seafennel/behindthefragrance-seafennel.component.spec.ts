import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindthefragranceSeafennelComponent } from './behindthefragrance-seafennel.component';

describe('BehindthefragranceSeafennelComponent', () => {
  let component: BehindthefragranceSeafennelComponent;
  let fixture: ComponentFixture<BehindthefragranceSeafennelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindthefragranceSeafennelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindthefragranceSeafennelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
