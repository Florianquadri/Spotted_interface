import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LayoutPageRoutingModule } from './layout-routing.module';
import { LayoutPage } from './layout.page';
import { AddPlaceComponent } from '../add-place/add-place.component';
import { PlaceFromLieuxComponent } from '../place-from-lieux/place-from-lieux.component';
import {ViewAvisListComponent} from '../view-avis-list/view-avis-list.component'



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutPageRoutingModule,
    ReactiveFormsModule,

  ],
  declarations: [LayoutPage,AddPlaceComponent,PlaceFromLieuxComponent, ViewAvisListComponent]
})
export class LayoutPageModule {}
