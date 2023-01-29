import { ViewAvisListComponent } from 'src/app/view-avis-list/view-avis-list.component';
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
  declarations: [ViewAvisListComponent],
  exports: [ViewAvisListComponent]
})
export class ViewAvisListModule {}
