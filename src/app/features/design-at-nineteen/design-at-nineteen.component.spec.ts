import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignAtNineteenComponent } from './design-at-nineteen.component';

describe('DesignAtNineteenComponent', () => {
  let component: DesignAtNineteenComponent;
  let fixture: ComponentFixture<DesignAtNineteenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignAtNineteenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignAtNineteenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
