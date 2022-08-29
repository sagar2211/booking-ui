import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SomethingWentWrongComponent } from './something-went-wrong/something-went-wrong.component';

const routes: Routes = [
  {
    path : '404',
    component : NotFoundComponent
  },
  {
    path : 'something-went-wrong',
    component : SomethingWentWrongComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorPageRoutingModule { }
