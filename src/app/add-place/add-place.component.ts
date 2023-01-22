import { Component } from '@angular/core';
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
import { CreateRequestOptions } from 'ionic';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { User } from '../models/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavParams } from 'node_modules/@ionic/angular';


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
  coordinates: number[];




    



    constructor(
      private http: HttpClient,
      private modalCtrl: ModalController,
      private pictureService: PictureService,
      private placeService: PlacesService,
      private auth: AuthService,
      private fb: FormBuilder,
      private navParams: NavParams
      ) {
        this.form = this.fb.group({
          placeName: new FormControl('', [Validators.required]),
          placeCanton: new FormControl('',[Validators.required])
        });
        this.coordinates = this.navParams.get('coordinates');
        
     
    }

    takePicture = async () => {
      /* const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      }); */
    
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      // var imageUrl = image.webPath;
    
      // Can be set to the src of an image now
     // imageElement.src = imageUrl;

     this.picture = this.pictureService.takeAndUploadPicture$().subscribe();
console.log(this.picture)
    };

    cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  

    confirm() {
  
      this.dataForm.push(this.form.value);
      
     this.data = {"name": this.dataForm[0].placeName,
                  "canton": this.dataForm[0].placeCanton,
                  "location": {
                    "type": "Point",
                     "coordinates": this.coordinates},
                     "tags": ["tréjoli","trébo"]};

    console.log(this.data);

      /*  this.placeService.addPlace$(this.data).subscribe(); */
    
      this.refreshPlace();
      this.form.reset();

      return this.modalCtrl.dismiss('confirm');
    }

    refreshPlace() {
      this.placeService.getPlaces$()
        .subscribe(data => {
        
          
        })     
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




