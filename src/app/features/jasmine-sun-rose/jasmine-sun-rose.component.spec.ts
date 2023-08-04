import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JasmineSunRoseComponent } from './jasmine-sun-rose.component';

describe('JasmineSunRoseComponent', () => {
  let component: JasmineSunRoseComponent;
  let fixture: ComponentFixture<JasmineSunRoseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JasmineSunRoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JasmineSunRoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
