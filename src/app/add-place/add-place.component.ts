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
import { AlertController } from '@ionic/angular';

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
  public Array: any;
public imageElement;

  public chooseNote = [1,2,3,4,5];

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
   /*  private pictureService: PictureService, */
    private placeService: PlacesService,
    private fb: FormBuilder,
    private navParams: NavParams,
    private AlertController: AlertController,

  ) {
    this.form = this.fb.group({
      placeName: [''],
      note:[''],
      tag:[''],
      noteEcrite:['']
      /*       placeCanton: [''] */
    });
    this.coordinates = this.navParams.get('coordinates');


  }

 /*  convertBase64ToFormData(base64: string) {
    let binaryString = atob(base64);
    let len = binaryString.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
   
    let blob = new Blob([bytes], { type: 'image/jpeg/png' });
    
    return blob;
  } */

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64
      
      
    });

/*     var imageUrl = image.webPath;

    // Can be set to the src of an image now
    this.imageElement.src = imageUrl;
    console.log("por aquador");
    console.log(imageUrl); */

    console.log(image)
    this.imgRes = image.base64String;
  /*   this.imgRes = image; */
    
 /*    this.imgRes = this.convertBase64ToFormData(this.imgRes); */
 
    console.log("puree");
    console.log(this.imgRes);
  
    
}

async presentAlertName() {
  const alert = await this.AlertController.create({
    header: 'Alerte',
    subHeader: 'Erreur de Nom',
    message: "Veuillez entrer un nom d'au moins 3 caractères et qui contient uniquement des lettres",
    buttons: ['OK'],
  });

  await alert.present();
}


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
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

      //je reçois les noms des cantons avec "canton de / du / des ..., j'enlève la partie pour matcher avec ce que la database et le dropdown menu attende pour que la recherche par filtre fonctionne"
      console.log(resp.substring(0, 9))
      if (resp.substring(0, 9) == "canton d'") { this.canton = resp.substring(9) }
      else if (resp.substring(0, 9) == "canton du") { this.canton = resp.substring(10) }
      else if (resp.substring(0, 10) == "canton des") { this.canton = resp.substring(11) }
      else if (resp.substring(0, 9) == "canton de") { this.canton = resp.substring(10) }
      else { this.canton = resp }

      //il reste à gérer les cantons qui tont exception allemand-français pour coordonner mapbox, notre menu drop-down et notre api
      if (this.canton == "Saint-Gall") { this.canton = "St. Galles" }
      else if (this.canton == "Schaffhouse") { this.canton = "Schaffhausen" }
      else if (this.canton == "Tessin") { this.canton = "Ticino" }
      else if (this.canton == "Thurgovie") { this.canton = "Thurgovia" }
      else if (this.canton == "Zoug") { this.canton = "Zug" }
      //bug avec la la règle par défaut...
      else if (this.canton == "canton d’Appenzell Rhodes-Extérieures") { this.canton = "Appenzell rhodes-extérieures" }

      console.log(this.canton)

      this.dataForm.push(this.form.value);

      this.data = {
        "name": this.dataForm[0].placeName,
        "canton": this.canton,
        "location": {
          "type": "Point",
          "coordinates": this.coordinates
        },
        "tags": [this.dataForm[0].tag]
      };
     

      if (this.data.name.length <=2) {
      this.presentAlertName()
      }
      else{
        this.addMyPlace();
      }
      
    });


   


    this.form.reset();
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  addMyPlace() {
    this.placeService.addPlace$(this.data).subscribe((response) => {

      console.log(response);
      this.placeId = response;
      this.placeId = this.placeId._id;
      console.log(this.placeId)

      //créér la note
      let newNote = {
        stars: this.dataForm[0].note,
       text: this.dataForm[0].noteEcrite, 
        place: this.placeId
      }
      // Do something with the response
       this.placeService.addNote$(newNote, this.placeId).subscribe((resp)=>{
        console.log("Place ajoutée", newNote)
      })
        this.placeService.addPicture$(this.imgRes, this.placeId).subscribe((response) => {

        console.log( response);
        console.log("image ajoutée");
      },
      /* (error) => {
        console.log(error);
        console.log("ça marche pas vraiment brow");  
      } */);
      
    },
      (error) => {
        console.log(error);
        console.log("ça marche pas frérow");  
      });
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

  public tags = [
    'Piscine',
    'forêt',
    'trébo',
    'street photography',
    'lac',
    'montagne',
    'sunrise',
    'sunset',
    'treck',
    'monument',
    'panorama',
    'urbex',
    'glacier',
    'barrage',
    'incontournable',
    'astrophotographie',
    'lost but worth it',
  ];
}


