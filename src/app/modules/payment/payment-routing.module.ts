import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentUnsuccessComponent } from './payment-unsuccess/payment-unsuccess.component';

const routes: Routes = [
  {
    path : 'payment-form',
    component : PaymentFormComponent
  },
  {
    path : 'payment-success',
    component : PaymentSuccessComponent
  },
  {
    path : 'payment-unsuccess',
    component : PaymentUnsuccessComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaymentRoutingModule { }