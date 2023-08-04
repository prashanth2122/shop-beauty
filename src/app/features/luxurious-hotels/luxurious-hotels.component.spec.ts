import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxuriousHotelsComponent } from './luxurious-hotels.component';

describe('LuxuriousHotelsComponent', () => {
  let component: LuxuriousHotelsComponent;
  let fixture: ComponentFixture<LuxuriousHotelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuxuriousHotelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxuriousHotelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
