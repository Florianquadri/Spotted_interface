import { Component, OnInit } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';
import { Place } from '../models/place';
import { NotesService } from '../services/notes.service';


@Component({
  selector: 'app-place-modal-component',
  templateUrl: './place-modal-component.component.html',
  styleUrls: ['./place-modal-component.component.scss'],
})

export class PlaceModalComponentComponent implements OnInit {
  public data : Place;
  public notes = null;

  constructor(private modalCtrl: ModalController,
    private noteService: NotesService,) { }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnInit() {
    this.noteService.getNote$(this.data._id);
  }
  ionViewWillEnter(): void {
    // Make an HTTP request to retrieve the trips.
     console.log(this.data);
      this.noteService.getNote$(this.data._id).subscribe(e => {
        this.notes = e;
        console.log("ce que je recois",e);
        console.log(this.notes);   
      });
      

    
  }

}
