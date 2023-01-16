import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';

/* import { ImagePicker } from '@ionic-native/image-picker';
import { Observable } from 'rxjs'; */

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss'],
})
export class ModalExampleComponent {
    name: string;
    imgRes: any;
    options: any;

    constructor(private modalCtrl: ModalController,/* private imgPicker: ImagePicker */) {}
  
 /*    imagePicker() {
      this.options = {
        width: 200,
        quality: 30,
        outputType: 1
      };
      this.imgRes = [];
      this.imgPicker.getPictures(this.options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          this.imgRes.push('data:image/jpeg;base64,' + results[i]);
        }
      }, (error) => {
        alert(error);
      });
    } */

    cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
    }
  
    confirm() {
      return this.modalCtrl.dismiss(this.name, 'confirm');
    }

  ngOnInit() {}

  
}


