import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightListRoutingModule } from './flight-list-routing.module';
import { FlightsComponent } from './flights/flights.component';
import { FlightDetailsComponent } from './flight-details/flight-details.component';
import { MultiTripComponent } from './multi-trip/multi-trip.component';
import { OneWayRoundTripComponent } from './one-way-round-trip/one-way-round-trip.component';
import { MultiTripFlightDetailsComponent } from './multi-trip-flight-details/multi-trip-flight-details.component';
import { FilterModule } from '../filter/filter.module';
import { SharedModule } from '../shared/shared.module';
import { FlightSortComponent } from './flight-sort/flight-sort.component';

@NgModule({
  declarations: [
    FlightsComponent,
    FlightDetailsComponent,
    MultiTripComponent,
    OneWayRoundTripComponent,
    MultiTripFlightDetailsComponent,
    FlightSortComponent,
  ],
  imports: [
    CommonModule,
    FlightListRoutingModule,
    SharedModule,
    FilterModule
  ], exports: [
    FlightDetailsComponent
  ]
})
export class FlightListModule { }
