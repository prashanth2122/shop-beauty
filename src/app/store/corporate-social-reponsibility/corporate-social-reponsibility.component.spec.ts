import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateSocialReponsibilityComponent } from './corporate-social-reponsibility.component';

describe('CorporateSocialReponsibilityComponent', () => {
  let component: CorporateSocialReponsibilityComponent;
  let fixture: ComponentFixture<CorporateSocialReponsibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateSocialReponsibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateSocialReponsibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
