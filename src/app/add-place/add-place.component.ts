import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';


@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss'],
})
export class AddPlaceComponent {
    name: string;
    imgRes: any;
    options: any;

    constructor(private modalCtrl: ModalController) {}

    takePicture = async () => {
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
    
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      var imageUrl = image.webPath;
    
      // Can be set to the src of an image now
     // imageElement.src = imageUrl;
    };

    cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  
    confirm() {
      return this.modalCtrl.dismiss(this.name, 'confirm');
    }

  ngOnInit() {}

  onPlaceCreate(placeInfos: {placeName: string, placeCanton: string}){

  }
  
}


