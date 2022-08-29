import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUnsuccessComponent } from './payment-unsuccess.component';

describe('PaymentUnsuccessComponent', () => {
  let component: PaymentUnsuccessComponent;
  let fixture: ComponentFixture<PaymentUnsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentUnsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUnsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
