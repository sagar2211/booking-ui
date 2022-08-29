import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedHistoryComponent } from './completed-history.component';

describe('CompletedHistoryComponent', () => {
  let component: CompletedHistoryComponent;
  let fixture: ComponentFixture<CompletedHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
