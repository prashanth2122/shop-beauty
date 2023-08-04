import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindRhubarbRoseComponent } from './behind-rhubarb-rose.component';

describe('BehindRhubarbRoseComponent', () => {
  let component: BehindRhubarbRoseComponent;
  let fixture: ComponentFixture<BehindRhubarbRoseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindRhubarbRoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindRhubarbRoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
