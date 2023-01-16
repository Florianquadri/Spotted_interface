import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// TODO: import the ionic storage module.
import { IonicStorageModule } from "@ionic/storage-angular";
import { ReactiveFormsModule } from '@angular/forms';
import { PlaceModalComponentComponent } from './place-modal-component/place-modal-component.component';


//test
@NgModule({
  declarations: [AppComponent],
  imports: [ReactiveFormsModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true,},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
