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
   data:any;
    form: FormGroup;
    dataForm: any[] = [];
    public users: User[];
    public idUser : string;
    public surnameUser: string;
    public placeId = null;
    public place: Place[];
    imageUrl: any;
  coordinates: number[];
  public images : any;



    



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
          placeCanton: ['']
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
     /*  console.log("this.imgRes");
      console.log(this.imgRes); */
      
     /*  this.pictureService.picture$.subscribe(picture => {
        this.picture = picture;
      });
      console.log(this.picture); */

     /* this.picture = this.pictureService.takeAndUploadPicture$().subscribe(pictureDataPromise =>{
      this.picture = pictureDataPromise;
     }); */


    };

    cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  
    
/*     idee : addPlaces$(àenvoyer).then(result){
      addPictures$(picture, result_id)
      }
 */
    confirm() {

      this.dataForm.push(this.form.value);
 
     /*  this.auth.getUser$().subscribe((users) => {

        this.idUser = null;
        this.idUser = users.id;
        this.surnameUser = null;
      this.surnameUser = users.surname;
      }); */
      
      


     this.data = {"name": this.dataForm[0].placeName,
                  "canton": this.dataForm[0].placeCanton,
                  "location": {
                    "type": "Point",
                     "coordinates": this.coordinates},
                     "tags": ["trébo"]
                     };

    console.log(this.data);

        this.placeService.addPlace$(this.data).subscribe(); 

       this.placeService.getPlaces$().subscribe((places) => {
        console.log(places)
        /* this.placeId = places */
       });

      /* this.placeService.addPicture$(this.picture,this.placeId).subscribe(); */
    

      this.form.reset();
      return this.modalCtrl.dismiss(this.name, 'confirm');
    }
    
  ngOnInit() {}
  
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


