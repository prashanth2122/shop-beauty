import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiebarComponent } from './cookiebar.component';

describe('CookiebarComponent', () => {
  let component: CookiebarComponent;
  let fixture: ComponentFixture<CookiebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookiebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
