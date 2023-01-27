import { Component, OnInit } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';
import { Place } from '../models/place';
import { NotesService } from '../services/notes.service';
import { AddPlaceComponent } from '../add-place/add-place.component';

@Component({
  selector: 'app-place-modal-component',
  templateUrl: './place-modal-component.component.html',
  styleUrls: ['./place-modal-component.component.scss'],
})

export class PlaceModalComponentComponent implements OnInit {
  public data : Place;
  public notes = null;
  public pageName = null;
  public dataplacemodal:Place;
  


  constructor(private modalCtrl: ModalController,
    private noteService: NotesService,) { }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnInit() {
    this.noteService.getNotes$(this.data._id);
    this.dataplacemodal=this.data
    this.pageName = "mapmodal";
  }
  
  ionViewWillEnter(): void {
    
    // Make an HTTP request to retrieve the trips.
    this.noteService.getNotes$(this.data._id).subscribe((notes) => {
      this.data.averageNote =
        notes.length > 0
          ? notes.reduce((total, note) => (total += note.stars), 0) /
            notes.length
          : undefined;
    });
     
  }
  ionViewDidEnter():void {
    
  }
  ionViewDidLeave(){
    this.pageName=null
  }
}
