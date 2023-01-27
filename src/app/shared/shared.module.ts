import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaleriePhotoComponent } from '../galerie-photo/galerie-photo.component';



@NgModule({
  declarations: [GaleriePhotoComponent],
  imports: [
    CommonModule],
  exports: [GaleriePhotoComponent]
})
export class SharedModule { }
