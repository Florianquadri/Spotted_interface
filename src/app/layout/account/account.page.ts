import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AuthService } from './../../auth/auth.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotesService } from 'src/app/services/notes.service';
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place';
import { Note } from 'src/app/models/note';
import { catchError } from 'rxjs/operators';
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
  public notePassee2 =null;
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
      this.data = places;
      console.log(this.data);
      this.placeId = null;
      this.placeId = this.data[0]._id;

      for (let index = 0; index < this.data.length; index++) {
        this.placeId = this.data[index]._id;

        this.noteService
          .getNote$(this.placeId).subscribe((
            (notes) => {
                this.test[index] = notes[0].stars         
            })
          )

        if (this.test[index]="5"||this.test[index]=="1") {
          
            this.noteService
              .getNote$(this.placeId)
              .pipe(
                catchError((error) => {
                  return throwError('Erreur lors de la récupération des données');
                })
              )
              .subscribe(
                (notes) => {
                  //console.log("Voici mon notes: "+ notes);
                    this.notePassee[index] = notes[0].stars;
                    console.log('voici ma note : ' + notes[0].stars);
                    //console.log(notes);
                    this.notePassee2 = this.notePassee[index]
                },
                (error) => {
                  console.log('problème ici');
                }
              );
          
        }
      }
    });
  }

  goOnChosenPlace(place){
    this.router.navigate(['src/app/place-from-lieux/place-from-lieux.component', { param: JSON.stringify(place) }]);
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
