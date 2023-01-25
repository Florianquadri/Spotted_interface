import { Component, OnInit, Input } from '@angular/core';
import { AccountPageModule } from '../layout/account/account.module';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-galerie-photo',
  templateUrl: './galerie-photo.component.html',
  styleUrls: ['./galerie-photo.component.scss'],
  template: `
  <img [src]="imageGot">
`
})
export class GaleriePhotoComponent implements OnInit {
  @Input() maPropriete: any;

  constructor(private http: HttpClient) {}
  public imageGot: string;
  public data;
  public imageBinary = [];
  public base64Image;

  ngOnInit() {

if (this.maPropriete="account") {
  this.data = this.http
      .get(
        'https://spotted-rest-api.onrender.com/places/63c54a1b94dfecd55034758a/pictures'
      )
      .subscribe((data) => {
         this.imageBinary = data[0].picture.data;
        /* console.log("ma data recue dans les photos : ");
        console.log(data[0].picture.data);  */

         // Suppose que vous avez une variable `imageBuffer` qui contient l'image en format Buffer
        this.imageGot = 'data:image/png;base64,' + Buffer.from(this.imageBinary).toString('base64');
        /* console.log("ma data traitée dans les photos : ");
        console.log(this.imageGot); */

        
      });
}
    

    console.log('galerie photo is working');

  }
}
