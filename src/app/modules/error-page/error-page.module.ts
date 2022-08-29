import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPageRoutingModule } from './error-page-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { SomethingWentWrongComponent } from './something-went-wrong/something-went-wrong.component';


@NgModule({
  declarations: [
    NotFoundComponent,
    SomethingWentWrongComponent
  ],
  imports: [
    CommonModule,
    ErrorPageRoutingModule
  ]
})
export class ErrorPageModule { }
