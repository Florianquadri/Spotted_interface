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
import { latLng, MapOptions, tileLayer, Map, marker, Marker } from 'leaflet';
import { defaultIcon } from '../../utile_files/default-marker';
import { locateMeIcon } from '../../utile_files/locateMe-marker';
import * as L from 'leaflet';
import { ModalController } from '@ionic/angular';
import { AddPlaceComponent } from '../../add-place/add-place.component';



@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements ViewWillEnter {



  // TRuc à faire dans un nouveau component modal onclick sur le HTML
  @Input() placeId: number = 0;

  ngOnInit() {
    this.noteService.getNotes$(this.placeId);
  }




  mapOptions: MapOptions;
  whichPlace: string;
  public places: Place[];
  public notes: Note[];

 
  public results = [];
  public data = [];
  map: Map;
  marker: L.Marker;
  mapMarkers: L.Marker[] = [];
  message = 'This modal example uses the modalController to present and dismiss modals.';
  chosenPlace : Place;


  constructor( // Inject the authentication provider.
    private auth: AuthService,
    private placeService: PlacesService,
    private noteService: NotesService,
    
    // Inject the router
    private router: Router,
    private http: HttpClient,
    private modalCtrl: ModalController,
  ) {
    this.mapOptions = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 18 }
        )
      ],
      zoom: 13,
      center: latLng(46.778186, 6.641524)
    };
  }


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddPlaceComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }

  onMapReady(map: Map) {
    setTimeout(() => map.invalidateSize(), 0);
    this.map = map;
    const center = this.map.getCenter();
    this.locateMe();
    this.getMapCurrentPosition();

  }

  async addDataToMap() {

    for (let i = 0; i < this.data.length; i++) {
      //const e = this.data[i];

      const marker = L.marker(([this.data[i].location.coordinates[0], 
        this.data[i].location.coordinates[1]]), 
        { icon: defaultIcon }).addTo(this.map);
        await marker.on('click',() => this.displayPlaceModal(this.data[i]))

        if (this.marker == this.mapMarkers[i]) {

      } else {
        this.mapMarkers.push(marker);
      }
      
    }
    console.log(this.mapMarkers);
  }

  async displayPlaceModal(place: []) {

    const modal = await this.modalCtrl.create({
      component: PlaceModalComponentComponent,
      componentProps: { data: place }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  
  }

  getMapCurrentPosition() {
    this.map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;

      const position = e.latlng
    }
    );
  }



  /*  changeIcon(){
    this.mapMarkers.forEach(marker => {
      marker.setIcon(defaultIcon);
    });
   } */



  handleChange(event) {
    const query = event.target.value.toLowerCase();
    if (query == "") {
      this.results = [];
    } else {
      this.results = this.data.filter(d => d.name.toLowerCase().indexOf(query) > -1);
      console.log(this.results)
    }

  }

  goOnChosenPoint(chosenPlace){
    console.log(chosenPlace.location.coordinates)
    this.map.setView(
      [chosenPlace.location.coordinates[0],
      chosenPlace.location.coordinates[1]]
    )
    this.results = [];
  }


  async locateMe() {  
   
    const location = await this.map.locate({setView: true, maxZoom: 16});

    this.map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;
      marker((e.latlng), { icon: defaultIcon }).addTo(this.map)
        .bindPopup("Vous êtes ici").openPopup();
      // circle(e.latlng, radius).addTo(this.map);
    }
    );

    this.map.on('locationerror', (e) => {
      console.log(e);
      alert(e.message);
    });
  }


  addMarker() {

    this.map.on('click', e => {

      this.marker = L.marker(e.latlng).addTo(this.map);

      this.mapMarkers.push(this.marker);

      this.mapOptions.center = this.marker.getLatLng();
      this.map.setView(
        this.marker.getLatLng(),
      )
      /*  this.marker.bindPopup("Nouveau marker").openPopup(); */

      this.mapMarkers.forEach(marker => {
        marker.setIcon(defaultIcon);
      });
      console.log(this.mapMarkers);

      setTimeout(() => {
        this.openModal();
      }, 200);


    });
  }



  ionViewWillEnter(): void {
    // Make an HTTP request to retrieve the trips.
    this.placeService.getPlaces$().subscribe(places => {
      //console.log(places)
      this.places = places;
      this.data = places;

      let placeId = null;
      this.noteService.getNotes$(placeId).subscribe(notes => {
        console.log(placeId)
        console.log(notes)
      });
      this.addDataToMap();
      /* console.log(this.data)
      console.log(this.data[4]) */

    })
  }


  logOut() {
    console.log("logging out...");
    this.auth.logOut();
    this.router.navigateByUrl("/login");
  }





}
