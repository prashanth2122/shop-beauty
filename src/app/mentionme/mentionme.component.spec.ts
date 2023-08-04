import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionmeComponent } from './mentionme.component';

describe('MentionmeComponent', () => {
  let component: MentionmeComponent;
  let fixture: ComponentFixture<MentionmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentionmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
