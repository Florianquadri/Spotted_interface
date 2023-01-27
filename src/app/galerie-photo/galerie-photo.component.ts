import { Component, OnInit, Input } from '@angular/core';
import { AccountPageModule } from '../layout/account/account.module';
import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Place } from '../models/place';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-galerie-photo',
  templateUrl: './galerie-photo.component.html',
  styleUrls: ['./galerie-photo.component.scss'],
  template: ` <img [src]="imageGot" /> `,
})
export class GaleriePhotoComponent implements OnInit {
  @Input() maPropriete: string;
  @Input() maData: Place;
  @Input() maDataAccount: Place[];

  constructor(private http: HttpClient,
    private AuthService: AuthService,) {}
  public imageGot: string;
  public data;
  public imageBinary = [];
  public base64Image;
  public dataplacemodal: Place;
  public dataPlaceAccount: Place;
  public userId = null;

  async ngOnInit() {
    this.AuthService.getUser$().subscribe((e) => {
      this.userId = e._id;
    });

    if (this.maPropriete == 'mapmodal') {
      console.log(this.maData);
      (this.data = this.http
        .get(
          `https://spotted-rest-api.onrender.com/places/${this.maData._id}/pictures`
        )
        .subscribe((data) => {
          this.imageBinary = data[0].picture.data;
          this.imageGot =
            'data:image/png;base64,' +
            Buffer.from(this.imageBinary).toString('base64');
        })),
        (error) => {
          console.log("y a un souci de pas d'images là");
        };
    }

    if (this.maPropriete == 'account') {
      this.data = this.http
        .get(
          `https://spotted-rest-api.onrender.com/users/${this.userId}/pictures`
        )
        .subscribe((data) => {
          /* console.log(data); */
          this.imageBinary = data[0].picture.data;
          /* console.log("ma data recue dans les photos : ");
              console.log(data[0].picture.data); */
          // Suppose que vous avez une variable `imageBuffer` qui contient l'image en format Buffer
          this.imageGot =
            'data:image/png;base64,' +
            Buffer.from(this.imageBinary).toString('base64');
          /* console.log("ma data traitée dans les photos : ");
              console.log(this.imageGot); */
        });
    }
  }

  }


