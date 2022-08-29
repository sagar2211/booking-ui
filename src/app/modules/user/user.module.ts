import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddUserInfoPopupComponent } from './add-user-info-popup/add-user-info-popup.component';


@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ChangePasswordComponent,
    UpdateProfileComponent,
    ForgotPasswordComponent,
    UserHomeComponent,
    AddUserInfoPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRoutingModule,
    SharedModule
  ],
  exports : [
    SignInComponent,
    SignUpComponent
  ], 
   schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class UserModule { }
