import { PlaceModalComponentComponent } from './../../place-modal-component/place-modal-component.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacesPageRoutingModule,
    LeafletModule,
  ],
  declarations: [PlacesPage,PlaceModalComponentComponent]
})
export class PlacesPageModule {}
