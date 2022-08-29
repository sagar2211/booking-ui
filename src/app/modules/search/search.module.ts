import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { SearchFlightComponent } from './search-flight/search-flight.component';
import { SharedModule } from '../shared/shared.module';
import { DailogBoxComponent } from './dailog-box/dailog-box.component';

@NgModule({
  declarations: [
    SearchFlightComponent,
    DailogBoxComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
  ]
})
export class SearchModule { }
