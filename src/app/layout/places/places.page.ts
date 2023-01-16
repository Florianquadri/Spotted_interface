import { PlaceModalComponentComponent } from './../../place-modal-component/place-modal-component.component';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
// TODO: import Angular's HTTP client.
import { HttpClient } from "@angular/common/http";
import { ViewWillEnter } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { NotesService } from 'src/app/services/notes.service';
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place';
import { FormsModule } from '@angular/forms';
import { Note } from 'src/app/models/note';
import { ModalController } from '@ionic/angular';




@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements ViewWillEnter {



  // TRuc à faire dans un nouveau component modal onclick sur le HTML
  @Input() placeId: number = 0;

  ngOnInit() {
    this.noteService.getNote$(this.placeId);
  }


  async displayPlaceModal(id: string) {

    const modal = await this.modalCtrl.create({
      component: PlaceModalComponentComponent,
      componentProps: { [this.placeId]: id}
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  
  }

  whichPlace: string;

  public places: Place[];
  public notes: Note[];

  public results = [];
  public data = []; 
 


  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter(d => d.name.toLowerCase().indexOf(query) > -1);
    console.log(this.results)
  }

  constructor( // Inject the authentication provider.
    private auth: AuthService,
    private placeService: PlacesService,
    private noteService: NotesService,
    private modal: PlaceModalComponentComponent,
    private modalCtrl: ModalController,
    // Inject the router
    private router: Router) { }


  ionViewWillEnter(): void {
    // Make an HTTP request to retrieve the trips.
    this.placeService.getPlaces$().subscribe(places => {
      console.log(places)
      this.places = places;
      this.data = places;

      let placeId = null;
      this.noteService.getNote$(placeId).subscribe(notes => {
        console.log(notes)
      });
    })
  }


  logOut() {
    console.log("logging out...");
    this.auth.logOut();
    this.router.navigateByUrl("/login");
  }


}
