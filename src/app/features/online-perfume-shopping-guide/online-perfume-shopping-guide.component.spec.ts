import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePerfumeShoppingGuideComponent } from './online-perfume-shopping-guide.component';

describe('OnlinePerfumeShoppingGuideComponent', () => {
  let component: OnlinePerfumeShoppingGuideComponent;
  let fixture: ComponentFixture<OnlinePerfumeShoppingGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinePerfumeShoppingGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinePerfumeShoppingGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
