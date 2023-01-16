import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-place-modal-component',
  templateUrl: './place-modal-component.component.html',
  styleUrls: ['./place-modal-component.component.scss'],
})
export class PlaceModalComponentComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }
  name: string;
  placeId : string;
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
  ngOnInit() {}

}
