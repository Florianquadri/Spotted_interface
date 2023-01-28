import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';
import { Place } from '../models/place';
import { NotesService } from '../services/notes.service';
import { AddPlaceComponent } from '../add-place/add-place.component';
import { PlacesService } from '../services/places.service';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-place-modal-component',
  templateUrl: './place-modal-component.component.html',
  styleUrls: ['./place-modal-component.component.scss'],
})

export class PlaceModalComponentComponent implements OnInit {
  public data: Place;
  public notes = null;
  public pageName = null;
  public dataplacemodal: Place;


  public chooseNote = [1, 2, 3, 4, 5];
  public noteChosen = 1;
  form: FormGroup;
  dataForm: any[] = [];
  public arrayCommentsLength : Number;

  /*   @Output() eventClickAddPlace = new EventEmitter<any>();
  
    addNoteToPlace(id){
      this.eventClickAddPlace.emit(id);
        } */

  constructor(private modalCtrl: ModalController,
    private noteService: NotesService, private placesService: PlacesService, private http: HttpClient, private fb: FormBuilder,) {
    this.form = this.fb.group({
      notePlace: [''],
      noteEcrite: ['']
    });
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmFormAddNoteToPlace() {
    console.log("click add note", this.data._id);
    //créér la note
    let newNote = {
      stars: this.form.value.notePlace,
      text: this.form.value.noteEcrite,
      place: this.data._id
    }
    this.placesService.addNote$(newNote, this.data._id).subscribe((resp) => {
      console.log(resp)
      this.cancel();
    },
      (error) => {
        console.log(error);
        console.log("ça marche pas frérow");
      })
  }

  viewAvis(){
    //si on a le temps, page pour voir tous les avis
  }

  ngOnInit() {
    this.noteService.getNotes$(this.data._id);
    this.dataplacemodal = this.data
    this.pageName = "mapmodal";
  }

  ionViewWillEnter(): void {

    // Make an HTTP request to retrieve the trips.
    this.noteService.getNotes$(this.data._id).subscribe((notes) => {
      this.data.commentaire = [];
      for (let oneNote of notes){
        if(oneNote.text){
          this.data.commentaire.push({"text" : oneNote.text, "author" : oneNote.author})
        }
      }
      console.log(this.data.commentaire)
      this.arrayCommentsLength = this.data.commentaire.length;
/*       this.data.commentaire = notes[0].text; */
   /*    console.log(this.data.commentaire) */
    });

    /*     this.placesService.getPlacesById$(this.data._id).subscribe((place) => {
          this.data.commentaire = place.notes;
        });  */

    this.noteService.getAverageNoteForAPlace$(this.data._id).subscribe((scoreNote) => {
      this.data.averageNote = scoreNote.score;
      this.data.numberReviews = scoreNote.nbReview;
      console.log(scoreNote)
    })

  }
  ionViewDidEnter(): void {

  }
  ionViewDidLeave() {
    this.pageName = null
  }
}
