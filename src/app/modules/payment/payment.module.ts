import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { SharedModule } from '../shared/shared.module';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentUnsuccessComponent } from './payment-unsuccess/payment-unsuccess.component';


@NgModule({
  declarations: [
    PaymentFormComponent,
    PaymentSuccessComponent,
    PaymentUnsuccessComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    SharedModule
  ]
})
export class PaymentModule { }
