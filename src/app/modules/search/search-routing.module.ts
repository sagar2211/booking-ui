import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFlightComponent } from './search-flight/search-flight.component';

const routes: Routes = [
  {
    path:'',redirectTo:'searchFlight'
  },
  {
    path:'searchFlight',component:SearchFlightComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }