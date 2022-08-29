import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicAuthComponent } from './components/basic-auth/basic-auth.component';

const routes: Routes = [
  { path : '', redirectTo: 'search', pathMatch: 'full'},
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    // canLoad: [BasicAuthGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./modules/search/search.module').then(m => m.SearchModule),
    // canLoad: [BasicAuthGuard]
  },
  {
    path: 'flight-list',
    loadChildren: () => import('./modules/flight-list/flight-list.module').then(m => m.FlightListModule),
    // canLoad: [BasicAuthGuard]
  },
  {
    path: 'flight-booking',
    loadChildren: () => import('./modules/flight-booking/flight-booking.module').then(m => m.FlightBookingModule),
    // canLoad: [BasicAuthGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./modules/payment/payment.module').then(m => m.PaymentModule),
    // canLoad: [BasicAuthGuard]
  },
  {
    path: 'traveller',
    loadChildren: () => import('./modules/traveller/traveller.module').then(m => m.TravellerModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./modules/error-page/error-page.module').then(m => m.ErrorPageModule)
  },
  { path : 'basicAuth', component : BasicAuthComponent},
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
