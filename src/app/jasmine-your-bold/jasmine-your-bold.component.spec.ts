import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JasmineYourBoldComponent } from './jasmine-your-bold.component';

describe('JasmineYourBoldComponent', () => {
  let component: JasmineYourBoldComponent;
  let fixture: ComponentFixture<JasmineYourBoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JasmineYourBoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JasmineYourBoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
