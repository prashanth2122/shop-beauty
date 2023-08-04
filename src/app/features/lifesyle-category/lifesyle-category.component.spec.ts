import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifesyleCategoryComponent } from './lifesyle-category.component';

describe('LifesyleCategoryComponent', () => {
  let component: LifesyleCategoryComponent;
  let fixture: ComponentFixture<LifesyleCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifesyleCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifesyleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
