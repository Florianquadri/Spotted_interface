import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';
import { GaleriePhotoComponent } from 'src/app/galerie-photo/galerie-photo.component';
import { AccountPage } from './account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    
  ],
  declarations: [AccountPage,GaleriePhotoComponent]
})
export class AccountPageModule {}
