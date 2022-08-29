import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/_helpers/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  {path: '', component:UserHomeComponent,
  children:[
  { path : 'login', component: SignInComponent},
  { path : 'signUp', component: SignUpComponent},
  { path : 'changePassword', component: ChangePasswordComponent, canActivate:[AuthGuard]},
  { path : 'forgotPassword', component: ForgotPasswordComponent},
  { path : 'updateProfile', component: UpdateProfileComponent, canActivate:[AuthGuard]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
