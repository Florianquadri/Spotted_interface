import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPage } from './layout.page';

const routes: Routes = [
  {
    path: '',
/*     redirectTo:"places",
    pathMatch:"full", */
    component: LayoutPage,
    children: [{
      path:'',
      redirectTo:'places',
      pathMatch:"full"
    },
      {
        path: 'places',
        loadChildren: () => import('./places/places.module').then(m => m.PlacesPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule { }
