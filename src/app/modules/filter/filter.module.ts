import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterRoutingModule } from './filter-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FilterFilghtComponent } from './filter-filght/filter-filght.component';


@NgModule({
  declarations: [
    FilterFilghtComponent
  ],
  imports: [
    CommonModule,
    FilterRoutingModule,
    SharedModule
  ],exports:[
    FilterFilghtComponent
  ]
})
export class FilterModule { }
