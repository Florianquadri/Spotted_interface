import { PlaceFromLieuxComponent } from 'src/app/place-from-lieux/place-from-lieux.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeafletModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [PlaceFromLieuxComponent],
  exports: [PlaceFromLieuxComponent]
})
export class PlaceFromLieuxModule {}
