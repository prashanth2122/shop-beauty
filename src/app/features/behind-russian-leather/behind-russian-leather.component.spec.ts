import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindRussianLeatherComponent } from './behind-russian-leather.component';

describe('BehindRussianLeatherComponent', () => {
  let component: BehindRussianLeatherComponent;
  let fixture: ComponentFixture<BehindRussianLeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindRussianLeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindRussianLeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
