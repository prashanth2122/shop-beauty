import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeraniumBlurTheLinesComponent } from './geranium-blur-the-lines.component';

describe('GeraniumBlurTheLinesComponent', () => {
  let component: GeraniumBlurTheLinesComponent;
  let fixture: ComponentFixture<GeraniumBlurTheLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeraniumBlurTheLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeraniumBlurTheLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
