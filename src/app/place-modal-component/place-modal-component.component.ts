import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';
import { Place } from '../models/place';
import { NotesService } from '../services/notes.service';
import { AddPlaceComponent } from '../add-place/add-place.component';
import { PlacesService } from '../services/places.service';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AuthService } from '../auth/auth.service'

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
  public whoIsConnected: string;
  @Output() eventShowListOfAvis = new EventEmitter<any>();
  public wantToEdit :boolean = false;


  imgRes: any;
  options: any;
  picture: any;
  updates : any;
  dataPatch : any;
  
  public chooseNote = [1, 2, 3, 4, 5];
  public noteChosen = 1;
  form: FormGroup;
  formPatch: FormGroup;
  dataForm: any[] = [];
  public arrayCommentsLength: Number;

  /*   @Output() eventClickAddPlace = new EventEmitter<any>();
  
    addNoteToPlace(id){
      this.eventClickAddPlace.emit(id);
        } */

  constructor(private modalCtrl: ModalController,
    private noteService: NotesService, private placesService: PlacesService, private http: HttpClient, private fb: FormBuilder,
    private ngZone: NgZone, private router: Router, private route: ActivatedRoute, private AuthService: AuthService,) {
    this.form = this.fb.group({
      notePlace: [''],
      noteEcrite: ['']
    });

    this.formPatch = this.fb.group({
      namePlaceUpdate: [''],
    });

  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  showFormModifyPlace(){
    this.wantToEdit = !this.wantToEdit
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

      /// AJOUT PHOTO PLACE
      this.placesService.addPictureToPlace$(this.imgRes, this.data._id).subscribe((response) => {

        console.log( response);
        console.log("image ajoutée");
      },
      (error) => {
        console.log(error);
        console.log("ça marche pas vraiment brow");  
      });

      ////FIN AJOUT PHOTO PALCE
    },
      (error) => {
        console.log(error);
        console.log("ça marche pas frérow");
      })
  }


  deleteNote(idNote, idPlace) {
    console.log("je tente de supprimer la note", idNote, "de la place", idPlace)
    this.noteService.deleteNotes$(idNote, idPlace).subscribe((resp) => {
      console.log(resp, "bien supprimé")
    })
    this.getNotes();
    console.log(idNote)
  }

  viewAvis(allAvis) {
    this.router.navigate(
      ['./view-avis-list', { param: JSON.stringify(allAvis) }],
      { relativeTo: this.route }
    );
    this.cancel();
  }
  patchPlace() {
    this.dataPatch = this.formPatch.value;
    console.log(this.formPatch.value.namePlaceUpdate)
   this.updates = {
    name: this.formPatch.value.namePlaceUpdate,
    canton : this.data.canton
  }
  console.log("dataPatch")
  console.log(this.updates.name)
  console.log(this.dataPatch)
    this.placesService.patchPlace$(this.data._id, this.updates)
    .subscribe(
      (response) => {
        console.log('Place successfully updated.');
      },
      (error) => {
        console.log('Error updating place:', error);
      }
    );
  
  }


  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      
    });
    console.log(image)
    this.imgRes = image.base64String;

    console.log("puree");
    console.log(this.imgRes);
}

  getNotes() {
    // Make an HTTP request to retrieve the trips.
    this.noteService.getNotes$(this.data._id).subscribe((notes) => {
      this.data.commentaire = [];
      for (let oneNote of notes) {
        console.log(oneNote)
        if (oneNote.text) {
          this.data.commentaire.push({ "text": oneNote.text, "author": oneNote.author, "id": oneNote._id, "place": oneNote.place })
        }
      }
      console.log(this.data.commentaire)
      this.arrayCommentsLength = this.data.commentaire.length;
      /*       this.data.commentaire = notes[0].text; */
      /*    console.log(this.data.commentaire) */
    });
  }

  ngOnInit() {
    this.noteService.getNotes$(this.data._id);
    this.dataplacemodal = this.data
    this.pageName = "mapmodal";

    this.AuthService.getUser$().subscribe((resp) => {
      console.log(resp)
      this.whoIsConnected = resp._id;
      console.log(this.whoIsConnected)
    })
  }

  ionViewWillEnter(): void {

    this.getNotes();

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
