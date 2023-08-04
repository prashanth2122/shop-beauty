import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtHomeWithLustLivingComponent } from './at-home-with-lust-living.component';

describe('AtHomeWithLustLivingComponent', () => {
  let component: AtHomeWithLustLivingComponent;
  let fixture: ComponentFixture<AtHomeWithLustLivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtHomeWithLustLivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtHomeWithLustLivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
