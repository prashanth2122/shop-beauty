import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindOnlineExclusiveComponent } from './behind-online-exclusive.component';

describe('BehindOnlineExclusiveComponent', () => {
  let component: BehindOnlineExclusiveComponent;
  let fixture: ComponentFixture<BehindOnlineExclusiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindOnlineExclusiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindOnlineExclusiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
