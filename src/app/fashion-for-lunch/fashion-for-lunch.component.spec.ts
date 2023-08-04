import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FashionForLunchComponent } from './fashion-for-lunch.component';

describe('FashionForLunchComponent', () => {
  let component: FashionForLunchComponent;
  let fixture: ComponentFixture<FashionForLunchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FashionForLunchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FashionForLunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
