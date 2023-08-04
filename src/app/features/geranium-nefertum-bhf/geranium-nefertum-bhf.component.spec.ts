import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeraniumNefertumBhfComponent } from './geranium-nefertum-bhf.component';

describe('GeraniumNefertumBhfComponent', () => {
  let component: GeraniumNefertumBhfComponent;
  let fixture: ComponentFixture<GeraniumNefertumBhfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeraniumNefertumBhfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeraniumNefertumBhfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
