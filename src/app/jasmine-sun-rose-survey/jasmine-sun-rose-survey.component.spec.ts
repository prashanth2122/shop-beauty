import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JasmineSunRoseSurveyComponent } from './jasmine-sun-rose-survey.component';

describe('JasmineSunRoseSurveyComponent', () => {
  let component: JasmineSunRoseSurveyComponent;
  let fixture: ComponentFixture<JasmineSunRoseSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JasmineSunRoseSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JasmineSunRoseSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
