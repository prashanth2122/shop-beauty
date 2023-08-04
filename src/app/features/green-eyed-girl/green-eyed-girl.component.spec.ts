import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenEyedGirlComponent } from './green-eyed-girl.component';

describe('GreenEyedGirlComponent', () => {
  let component: GreenEyedGirlComponent;
  let fixture: ComponentFixture<GreenEyedGirlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreenEyedGirlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenEyedGirlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
