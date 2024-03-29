import { PlaceFromLieuxComponent } from './place-from-lieux/place-from-lieux.component';
import {ViewAvisListComponent} from './view-avis-list/view-avis-list.component'
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "",
     // Add the guard to the canActivate array of this route
     canActivate: [AuthGuard],
    loadChildren: () =>
      import("./layout/layout.module").then((m) => m.LayoutPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
