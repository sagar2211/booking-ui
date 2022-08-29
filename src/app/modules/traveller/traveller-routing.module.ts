import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefundPopupComponent } from './refund-popup/refund-popup.component';
import { TravelHistoryComponent } from './travel-history/travel-history.component';
import { TravellerHomeComponent } from './traveller-home/traveller-home.component';

const routes: Routes = [
  {
    path : '',
    component : TravellerHomeComponent,
    children:[
      {
        path : 'travel-history',
        component : TravelHistoryComponent,
      },
      {
        path : 'refund',
        component : RefundPopupComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravellerRoutingModule { }
