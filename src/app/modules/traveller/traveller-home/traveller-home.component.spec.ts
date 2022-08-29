import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellerHomeComponent } from './traveller-home.component';

describe('TravellerHomeComponent', () => {
  let component: TravellerHomeComponent;
  let fixture: ComponentFixture<TravellerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravellerHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravellerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
