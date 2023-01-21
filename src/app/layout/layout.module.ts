import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LayoutPageRoutingModule } from './layout-routing.module';
import { LayoutPage } from './layout.page';
import { AddPlaceComponent } from '../add-place/add-place.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutPageRoutingModule,
    ReactiveFormsModule,

  ],
  declarations: [LayoutPage,AddPlaceComponent,]
})
export class LayoutPageModule {}
