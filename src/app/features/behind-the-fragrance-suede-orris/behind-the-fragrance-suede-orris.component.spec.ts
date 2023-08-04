import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindTheFragranceSuedeOrrisComponent } from './behind-the-fragrance-suede-orris.component';

describe('BehindTheFragranceSuedeOrrisComponent', () => {
  let component: BehindTheFragranceSuedeOrrisComponent;
  let fixture: ComponentFixture<BehindTheFragranceSuedeOrrisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BehindTheFragranceSuedeOrrisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindTheFragranceSuedeOrrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
