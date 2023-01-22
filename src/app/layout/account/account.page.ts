import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AuthService } from './../../auth/auth.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';
import { NotesService } from 'src/app/services/notes.service';
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place';
import { Note } from 'src/app/models/note';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage /* implements OnInit */ {
  public data = [];
  public name = null;
  public pseudo = null;
  public placeId = null;

  public places: Place[];
  public notes: Note[];
  public notePassee = [];
  public currentSegment = null;
  constructor(
    private AuthService: AuthService,
    private placeService: PlacesService,
    private noteService: NotesService
  ) {}

  ngOnInit() {
    this.AuthService.getUser$();
  }

  ionViewWillEnter(): void {
    // Make an HTTP request to retrieve the trips.
    console.log('ma data :' + this.data);
    this.AuthService.getUser$().subscribe((e) => {
      this.name = e.name;
      this.pseudo = e.surname;
      console.log('ce que je recois', e);
    });

    this.placeService.getPlaces$().subscribe((places) => {
      //console.log(places)
      this.data = places;
      console.log(this.data);
      this.placeId = null;
      this.placeId = this.data[0]._id;

      for (let index = 0; index < this.data.length; index++) {
        this.placeId = this.data[index]._id;

        for (let place of this.data) {
          this.noteService
            .getNote$(this.placeId)
            .pipe(
              catchError((error) => {
                return throwError('Erreur lors de la récupération des données');
              })
            )
            .subscribe(
              (notes) => {
                if (notes.length > 0) {
                  this.notePassee[index] = notes[0].stars;
                  console.log('voici ma note : ' + notes[0].stars);
                  console.log(this.notePassee);
                  //console.log(notes);
                } 
              },
              (error) => {
                console.log('problème ici');
              }
            );
        }
      }
    });
  }

  segmentChanged(event) {
    // console.log(event.detail);
    if (event.detail.value === 'photos') {
      this.currentSegment = 'photos';
    } else if (event.detail.value === 'lieux') {
      this.currentSegment = 'lieux';
    }
  }
}
