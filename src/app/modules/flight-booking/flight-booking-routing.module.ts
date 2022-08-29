import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AncillariesComponent } from './ancillaries/ancillaries.component';
import { FlightBookingHomeComponent } from './flight-booking-home/flight-booking-home.component';
import { ReviewBookingComponent } from './review-booking/review-booking.component';
import { HepstarServicesComponent } from './hepstar-services/hepstar-services.component';

const routes: Routes = [
  {
    path : '', component : FlightBookingHomeComponent,
    children : [
      { path : 'review-booking', component : ReviewBookingComponent },
      { path : 'ancillaries-info', component: AncillariesComponent},
      { path : 'hepstar-service', component: HepstarServicesComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightBookingRoutingModule { }
