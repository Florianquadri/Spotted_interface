import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AuthService } from './../../auth/auth.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { ModalController } from 'node_modules/@ionic/angular';
import { NotesService } from 'src/app/services/notes.service';
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place';
import { Note } from 'src/app/models/note';
import { catchError, flatMap, tap, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { PlaceFromLieuxComponent } from 'src/app/place-from-lieux/place-from-lieux.component';
import { Router, ActivatedRoute } from '@angular/router';

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
  public test = [];
  public notePassee2 = null;
  public currentSegment = null;
  constructor(
    private AuthService: AuthService,
    private placeService: PlacesService,
    private noteService: NotesService,
    private router: Router,
    private route: ActivatedRoute
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
      this.places = places;

      for (const place of places) {
        this.noteService.getNotes$(place._id).subscribe((notes) => {
          place.averageNote =
            notes.length > 0
              ? notes.reduce((total, note) => (total += note.stars), 0) /
                notes.length
              : undefined;
        },(error) => {
          console.log("y a un souci de pas de notes");
        });
      }
    });
  }

  goOnChosenPlace(place) {
    this.router.navigate(
      ['./place-details', { param: JSON.stringify(place) }],
      { relativeTo: this.route }
    );
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
