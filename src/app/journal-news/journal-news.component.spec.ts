import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalNewsComponent } from './journal-news.component';

describe('JournalNewsComponent', () => {
  let component: JournalNewsComponent;
  let fixture: ComponentFixture<JournalNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
