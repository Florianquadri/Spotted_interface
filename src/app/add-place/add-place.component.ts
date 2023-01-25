import { Component, Sanitizer } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PictureService } from 'src/app/services/picture.service';
import { subscribeOn } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { Observable } from 'rxjs/internal/Observable';
import { Place } from "../models/place";
import { AuthService } from "src/app/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment"
/* import { CLIENT_RENEG_LIMIT } from 'tls'; */
import { User } from '../models/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavParams } from 'node_modules/@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss'],
})
export class AddPlaceComponent {
  name: string;
  canton: string;
  imgRes: any;
  options: any;
  picture: any;
  data: any;
  form: FormGroup;
  dataForm: any[] = [];
  public users: User[];
  public idUser: string;
  public surnameUser: string;
  public placeId = null;
  public place: Place[];
  imageUrl: any;
  coordinates: number[];
  public images: any;

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private pictureService: PictureService,
    private placeService: PlacesService,
    private auth: AuthService,
    private fb: FormBuilder,
    private navParams: NavParams,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      placeName: [''],
      /*       placeCanton: [''] */
    });
    this.coordinates = this.navParams.get('coordinates');


  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    this.imgRes = image.base64String;
    /* console.log("this.imgRes");
    console.log(this.imgRes); */

  };

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  /*     idee : addPlaces$(àenvoyer).then(result){
        addPictures$(picture, result_id)
        }
   */

confirm2(){
  this.placeService.addPlace$(this.data).subscribe((response) => {

    console.log(response);
    this.placeId = response;
    this.placeId = this.placeId._id;
    console.log(this.placeId)
    // Do something with the response
  },
    (error) => {
      console.log(error);
      // Handle the error
    });
}

  confirm() {
    this.dataForm.push(this.form.value);
    console.log(this.coordinates)
    this.placeService.getCantonsByCoordinates$(this.coordinates[0], this.coordinates[1]).subscribe((resp) => {
      console.log(resp)
      this.canton = resp;
      //lié à langue différente, l'orthographe de certains cantons doivent être repris pour matcher celle de notre filtre de cantons

/*       switch (resp) {
        case 'St. Gallen':
          this.canton = "StGall"
          break;
        case 'Aargau':
          this.canton = "StGall"
          break;
        case 'Papayas':
        default:
          this.canton = resp;
      } */

      //juste problème à régler avec accent ou tiret envoyé dans la database
      console.log(resp.substring(0,9))
if(resp.substring(0,9) == "canton d'"){this.canton = resp.substring(9)}
else if(resp.substring(0,9)== "canton du"){this.canton = resp.substring(10)}
else if(resp.substring(0,10)== "canton des"){this.canton = resp.substring(11)}
  else if(resp.substring(0,9)== "canton de"){this.canton = resp.substring(10)}
else {this.canton = resp}


/*       if(resp == "St. Gallen"){this.canton = "StGall"}
      else if(resp == "Aargau"){this.canton = "Argovie"}
      else if(resp == "Basel-Landschaft"){this.canton = "BaleCampagne"}
      else {this.canton = resp} */
      console.log(this.canton)
      this.dataForm.push(this.form.value);
      this.data = {
        "name": this.dataForm[0].placeName,
        "canton": this.canton,
        "location": {
          "type": "Point",
          "coordinates": this.coordinates
        },
        "tags": ["trébo"]
      };
      console.log(this.data);
      this.confirm2();
    });

    //this.coordinates à mapbox



    /* this.placeService.addPlace$(this.data).subscribe(); */



/*     this.placeService.addPlace$(this.data).subscribe((response) => {

      console.log(response);
      this.placeId = response;
      this.placeId = this.placeId._id;
      console.log(this.placeId)
      // Do something with the response
    },
      (error) => {
        console.log(error);
        // Handle the error
      }); */


    this.placeService.addPicture$(this.picture, this.placeId).subscribe((response) => {

      console.log("PARCEQUEONESTPASCOUCHENANANA" + response);
    });


    this.form.reset();
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  ngOnInit() { }

  public cantons = ["Appenzell Rhodes-Extérieures",
    "Appenzell Rhodes-Extérieures",
    "Argovie",
    "Bâle-Campagne",
    "Bâle-Ville",
    "Berne",
    "Fribourg",
    "Genève",
    "Glaris",
    "Grisons",
    "Jura",
    "Lucerne",
    "Neuchâtel",
    "Nidwald",
    "Obwald",
    "Saint-Gall",
    "Schaffhouse",
    "Schwytz",
    "Soleure",
    "Tessin",
    "Thurgovie",
    "Uri",
    "Valais",
    "Vaud",
    "Zoug",
    "Zurich"
  ]

}


