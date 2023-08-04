import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaxingBathGuideComponent } from './relaxing-bath-guide.component';

describe('RelaxingBathGuideComponent', () => {
  let component: RelaxingBathGuideComponent;
  let fixture: ComponentFixture<RelaxingBathGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelaxingBathGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelaxingBathGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
