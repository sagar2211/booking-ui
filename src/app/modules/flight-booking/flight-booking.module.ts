import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightBookingRoutingModule } from './flight-booking-routing.module';
import { FlightBookingHomeComponent } from './flight-booking-home/flight-booking-home.component';
import { ReviewBookingComponent } from './review-booking/review-booking.component';
import { SharedModule } from '../shared/shared.module';
import { LoginSignupPopupComponent } from './login-signup-popup/login-signup-popup.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PriceSidebarComponent } from './price-sidebar/price-sidebar.component';
import { AncillariesComponent } from './ancillaries/ancillaries.component';
import { FlightDetailsComponent } from '../flight-list/flight-details/flight-details.component';
import { FlightListModule } from '../flight-list/flight-list.module';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { HepstarServicesComponent } from './hepstar-services/hepstar-services.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    FlightBookingHomeComponent,
    ReviewBookingComponent,
    LoginSignupPopupComponent,
    SignInComponent,
    SignUpComponent,
    PriceSidebarComponent,
    AncillariesComponent,
    BookingFormComponent,
    HepstarServicesComponent
  ],
  imports: [
    
    CommonModule,
    FlightBookingRoutingModule,
    SharedModule,
    FlightListModule,
    MatDialogModule,
    MatExpansionModule
  ],
})
export class FlightBookingModule { }
