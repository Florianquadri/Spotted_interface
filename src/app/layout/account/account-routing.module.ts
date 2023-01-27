import { PlaceFromLieuxModule } from './../../place-from-lieux/place-from-lieux.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaceFromLieuxComponent } from 'src/app/place-from-lieux/place-from-lieux.component';
import { AccountPage } from './account.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
  },
  {
    path: 'place-details',
    data: {
      contexte : 'account'
    },
    component: PlaceFromLieuxComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes),PlaceFromLieuxModule],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
