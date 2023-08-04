import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopByColourComponent } from './shop-by-colour.component';

describe('ShopByColourComponent', () => {
  let component: ShopByColourComponent;
  let fixture: ComponentFixture<ShopByColourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopByColourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopByColourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
