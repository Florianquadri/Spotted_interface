import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PictureService } from 'src/app/services/picture.service';
import { subscribeOn } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { Observable } from 'rxjs/internal/Observable';
import { Place } from "../models/place";
import { FormGroup, FormControl } from '@angular/forms';
import { latLng, MapOptions, tileLayer, Map, marker, Marker } from 'leaflet';
import * as L from 'leaflet';
import { AuthService } from "src/app/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment"
import { CreateRequestOptions } from 'ionic';
import { CLIENT_RENEG_LIMIT } from 'tls';





@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss'],
})
export class AddPlaceComponent {
    name: string;
    imgRes: any;
    options: any;
    picture: any;
    public places: Place[];
    public place;
    map: Map;
    marker: L.Marker;
    mapMarkers: L.Marker[] = [];
    mapOptions: MapOptions;
    coordinate: L.LatLng;
    creator = undefined;
     userId = null;

    /////// test
    form = new FormGroup({
      placeName: new FormControl(),
      placeCanton: new FormControl(),
    });

    data = { name: '', canton: '' };

   

    constructor(private http: HttpClient,private modalCtrl: ModalController,private pictureService: PictureService,private placeService: PlacesService,private auth: AuthService,) {
      
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
this.getCreator();
      console.log(this.form.value.placeName)
      console.log(this.creator)

      /* this.placeService
    .addPlace(this.place,this.coordinate)
    .subscribe(place => {
      this.places.push(this.place)
    }); */
         
    this.http.post(`${environment.apiUrl}/places`, this.data).subscribe(response => {
      console.log(response);
    });

      this.refreshPlace();
      return this.modalCtrl.dismiss(this.name, 'confirm');
    }


getCreator(){
  
  this.creator = this.auth.getUser$();
  
}



    refreshPlace() {
      this.placeService.getPlaces$()
        .subscribe(data => {
          console.log(data)
          this.place=data;
        })     
    }

  ngOnInit() {}

  onPlaceCreate(placeInfos: {placeName: string, placeCanton: string}){}
  
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


