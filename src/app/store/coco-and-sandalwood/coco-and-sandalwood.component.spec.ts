import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocoAndSandalwoodComponent } from './coco-and-sandalwood.component';

describe('CocoAndSandalwoodComponent', () => {
  let component: CocoAndSandalwoodComponent;
  let fixture: ComponentFixture<CocoAndSandalwoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocoAndSandalwoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocoAndSandalwoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
