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
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule } from '@angular/forms';
import { PlacesPage } from './layout/places/places.page';
import { Observable } from 'rxjs'; 


//test
@NgModule({
  declarations: [AppComponent,],
  imports: [LeafletModule,ReactiveFormsModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot()],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true,},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
