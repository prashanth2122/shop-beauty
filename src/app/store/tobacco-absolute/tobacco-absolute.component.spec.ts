import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TobaccoAbsoluteComponent } from './tobacco-absolute.component';

describe('TobaccoAbsoluteComponent', () => {
  let component: TobaccoAbsoluteComponent;
  let fixture: ComponentFixture<TobaccoAbsoluteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TobaccoAbsoluteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TobaccoAbsoluteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
