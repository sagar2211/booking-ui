import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravellerRoutingModule } from './traveller-routing.module';
import { AddTravellerComponent } from './add-traveller/add-traveller.component';
import { SharedModule } from '../shared/shared.module';
import { TravelHistoryComponent } from './travel-history/travel-history.component';
import { TravellerHomeComponent } from './traveller-home/traveller-home.component';
import { RefundPopupComponent } from './refund-popup/refund-popup.component';
import { UpcomingHistoryComponent } from './upcoming-history/upcoming-history.component';
import { CancelledHistoryComponent } from './cancelled-history/cancelled-history.component';
import { CompletedHistoryComponent } from './completed-history/completed-history.component';


@NgModule({
  declarations: [
    AddTravellerComponent,
    TravelHistoryComponent,
    TravellerHomeComponent,
    RefundPopupComponent,
    UpcomingHistoryComponent,
    CancelledHistoryComponent,
    CompletedHistoryComponent
  ],
  imports: [
    CommonModule,
    TravellerRoutingModule,
    SharedModule
  ]
})
export class TravellerModule { }
