import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingHistoryComponent } from './upcoming-history.component';

describe('UpcomingHistoryComponent', () => {
  let component: UpcomingHistoryComponent;
  let fixture: ComponentFixture<UpcomingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
