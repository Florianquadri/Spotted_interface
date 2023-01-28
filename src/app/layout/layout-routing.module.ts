import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaceFromLieuxComponent } from '../place-from-lieux/place-from-lieux.component';
import {ViewAvisListComponent} from '../view-avis-list/view-avis-list.component'
import { LayoutPage } from './layout.page';

const routes: Routes = [
  {
    path: '',
    /*     redirectTo:"places",
    pathMatch:"full", */
    component: LayoutPage,
    children: [
      {
        path: '',
        redirectTo: 'places',
        pathMatch: 'full',
      },
      {
        path: 'places',
        loadChildren: () =>
          import('./places/places.module').then((m) => m.PlacesPageModule),
      },      { path: 'view-avis-list', component: ViewAvisListComponent },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountPageModule),
      },
      { path: 'place-details', component: PlaceFromLieuxComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule {}
