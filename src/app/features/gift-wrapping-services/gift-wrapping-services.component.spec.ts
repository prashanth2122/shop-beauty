import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftWrappingServicesComponent } from './gift-wrapping-services.component';

describe('GiftWrappingServicesComponent', () => {
  let component: GiftWrappingServicesComponent;
  let fixture: ComponentFixture<GiftWrappingServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftWrappingServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftWrappingServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
