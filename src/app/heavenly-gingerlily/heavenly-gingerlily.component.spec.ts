import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeavenlyGingerlilyComponent } from './heavenly-gingerlily.component';

describe('HeavenlyGingerlilyComponent', () => {
  let component: HeavenlyGingerlilyComponent;
  let fixture: ComponentFixture<HeavenlyGingerlilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeavenlyGingerlilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeavenlyGingerlilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
