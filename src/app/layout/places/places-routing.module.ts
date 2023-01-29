import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAvisListComponent } from 'src/app/view-avis-list/view-avis-list.component';

import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: '',
    component: PlacesPage
  },
  {
    path:'view-avis-list',
    data:{
      contexte:'places'
    },    component: ViewAvisListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
