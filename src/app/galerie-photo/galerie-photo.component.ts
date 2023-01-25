import { Component, OnInit,Input } from '@angular/core';
import { AccountPageModule } from '../layout/account/account.module';

@Component({
  selector: 'app-galerie-photo',
  templateUrl: './galerie-photo.component.html',
  styleUrls: ['./galerie-photo.component.scss'],
})

export class GaleriePhotoComponent implements OnInit {

@Input() maPropriete: any;

  constructor() { }

  ngOnInit() {
    console.log("ca marche la gallerie");
  } 

}
