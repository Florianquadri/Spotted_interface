import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
// TODO: import Angular's HTTP client.
import { HttpClient } from "@angular/common/http";
import { ViewWillEnter } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place';
import { FormsModule } from '@angular/forms';
import { latLng, MapOptions, tileLayer, Map, marker, Marker } from 'leaflet';
import { defaultIcon } from '../../utile_files/default-marker';
import { locateMeIcon } from '../../utile_files/locateMe-marker';

import * as L from 'leaflet';
import { ModalController } from '@ionic/angular';
import { ModalExampleComponent } from '../../add-place/add-place.component';


@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements ViewWillEnter {

  mapOptions: MapOptions;
  whichPlace: string;
  public places: Place[];
  public results = [];
  public data = [];
  map: Map;
  marker: L.Marker;
  mapMarkers: L.Marker[] = [];
  message = 'This modal example uses the modalController to present and dismiss modals.';
  chosenPlace: Place;
  chosenCanton: string;
  tagChosen : string;

  public cantons = ["Appenzell Rhodes-Extérieures",
    "Appenzell Rhodes-Extérieures",
    "Argovie",
    "Bâle-Campagne",
    "Bâle-Stadt",
    "Berne",
    "Fribourg",
    "Genève",
    "Glaris",
    "Grisons",
    "Jura",
    "Lucerne",
    "Neuchâtel",
    "Nidwald",
    "Obwald",
    "Saint-Gall",
    "Schaffhausen",
    "Schwytz",
    "Soleure",
    "Ticino",
    "Thurgovia",
    "Uri",
    "Valais",
    "Vaud",
    "Zug",
    "Zurich"
  ]

  public tags = ["waow", "insane", "sunset", "eau", "montagne", "calme"];


  constructor( // Inject the authentication provider.
    private auth: AuthService,
    private placeService: PlacesService,
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
      component: ModalExampleComponent,
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

  addDataToMap() {

    //reinitialiser avant d'ajouter
    this.mapMarkers = [];

    for (let i = 0; i < this.data.length; i++) {
      //const e = this.data[i];

      const marker = L.marker(([this.data[i].location.coordinates[0], this.data[i].location.coordinates[1]]), { icon: defaultIcon }).bindPopup(this.data[i].name);

      this.mapMarkers.push(marker);
    }
    console.log(this.mapMarkers);
  }

  getMapCurrentPosition() {
    this.map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;

      const position = e.latlng
      console.log(position);
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

  goOnChosenPoint(chosenPlace) {
    console.log(chosenPlace.location.coordinates)
    this.map.setView(
      [chosenPlace.location.coordinates[0],
      chosenPlace.location.coordinates[1]]
    )
    this.results = [];
  }

  filterByTag(tagChosen){
    console.log(tagChosen);
  }

  filterByCanton(chosenCanton) {
    console.log(chosenCanton.detail.value)
    this.placeService.getPlacesByCantons$(chosenCanton.detail.value).subscribe(places => {
      console.log(places)
      if (places.length == 0) {
        //ouverture popup avec message
        console.log("pas de place pour ce canton")
        /*         this.data = places;
                this.places = places;
                this.addDataToMap(); */

      }
      else {
        console.log("y'a des places")
        this.data = places;
        this.places = places;
        this.addDataToMap();
        console.log("test", this.data)
        //zoomer sur coordonnées centrales du canton + zoom plus vaste
        
      }
 
    })

    this.placeService.getCoordinatesForCantons$(chosenCanton.detail.value).subscribe(
      coordinates => {
        console.log(coordinates)
        this.map.setView([coordinates[1], coordinates[0]], 8  )
/*         this.mapOptions.zoom = 10; */
      }
      
    )
    //faire filtre en faisant appel à l'api
  }

  reinitialiseFiltres() {
    //penser à réinitialiser si appui sur bouton réinitialiser
    this.placeService.getPlaces$().subscribe(places => {
      //console.log(places)
      this.places = places;
      this.data = places;
      this.addDataToMap();
      this.locateMe();
      /* console.log(this.data)
      console.log(this.data[4]) */
    })

  }


  async locateMe() {
    this.addDataToMap();
    const location = await this.map.locate({ setView: true, maxZoom: 16 });

    this.map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;
      marker((e.latlng), { icon: locateMeIcon }).addTo(this.map)
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
      this.addDataToMap();
      /* console.log(this.data)
      console.log(this.data[4]) */

    })
  }

  ngOnInit() {


  }

  logOut() {
    console.log("logging out...");
    this.auth.logOut();
    this.router.navigateByUrl("/login");
  }





}
