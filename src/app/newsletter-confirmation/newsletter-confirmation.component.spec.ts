import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterConfirmationComponent } from './newsletter-confirmation.component';

describe('NewsletterConfirmationComponent', () => {
  let component: NewsletterConfirmationComponent;
  let fixture: ComponentFixture<NewsletterConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsletterConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsletterConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
