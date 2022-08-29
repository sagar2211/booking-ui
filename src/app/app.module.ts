import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { SharedModule } from './modules/shared/shared.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MiddleComponent } from './components/middle/middle.component';
import { BasicAuthComponent } from './components/basic-auth/basic-auth.component';
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { CarouselComponent } from './components/carousel/carousel.component';
@NgModule({
  declarations:[
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MiddleComponent,
    BasicAuthComponent,
    CarouselComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
  ],
  exports: [
    RouterModule
  ],
  schemas: [
   CUSTOM_ELEMENTS_SCHEMA
 ],
  bootstrap: [AppComponent],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})

export class AppModule { }
