import { PlaceModalComponentComponent } from './../../place-modal-component/place-modal-component.component';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
// TODO: import Angular's HTTP client.
import { HttpClient } from "@angular/common/http";
import { ViewWillEnter } from "node_modules/@ionic/angular";
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
import { ModalController } from 'node_modules/@ionic/angular';
import { AddPlaceComponent } from '../../add-place/add-place.component';



@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements ViewWillEnter {

  canActivate = true;


  // TRuc à faire dans un nouveau component modal onclick sur le HTML
  @Input() placeId: number = 0;

  ngOnInit() {
    this.noteService.getNotes$(this.placeId);
  }



  map: Map;
  marker: L.Marker;
  mapMarkers: L.Marker[] = [];
  mapOptions: MapOptions;
  whichPlace: string;
  public places: Place[];
  public notes: Note[];
public coordinates: any;
public coordinate: number[];
  public results = [];
  public data = [];

 
  message = 'This modal example uses the modalController to present and dismiss modals.';
  chosenPlace: Place;
  chosenCanton: string;
  tagChosen : string;
  //comment réinitialiser champ menu déroulant ?
  //pour savoir si un filtre est déjà activé et s'il faut ainsi les mixer
  searchByTAgActivated : boolean = false;
  searchByCantonActivated : boolean = false;
  mapViewChosen : boolean = true;

  public cantons = [/* "Tous", */"Appenzell Rhodes-Extérieures",
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

  public tags = ["Piscine","forêt", "street photography", "lac", "montagne", "sunrise", "sunset", "treck", "monument", "panorama", "urbex", "glacier", "barrage", "incontournable", "astrophotographie", "lost but worth it" ];


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
      componentProps: { coordinates: this.coordinate }
      
    });
   
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }

    modal.onDidDismiss().then(data => {

      this.marker.addTo(this.map);
      this.mapMarkers.push(this.marker);
      this.mapMarkers.forEach(marker => {
        marker.setIcon(defaultIcon);
      });
      console.log(this.mapMarkers);
      this.addDataToMap();
      

    });

  }

  

  onMapReady(map: Map) {
    setTimeout(() => map.invalidateSize(), 0);
    this.map = map;
    const center = this.map.getCenter();
    this.locateMe();
    this.getMapCurrentPosition();

  }

  async addDataToMap() {

    //reinitialiser avant d'ajouter
    this.mapMarkers = [];

    for (let i = 0; i < this.data.length; i++) {
      //const e = this.data[i];
      
      const marker = L.marker(([this.data[i].location.coordinates[0], this.data[i].location.coordinates[1]]), { icon: defaultIcon });
      await marker.on('click',() => this.displayPlaceModal(this.data[i]))
      this.mapMarkers.push(marker);
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
      chosenPlace.location.coordinates[1]], 13
    )
    this.results = [];
  }
  filterByTag(tagChosen){
    this.searchByTAgActivated = true;
    this.tagChosen = tagChosen.detail.value;
    console.log(tagChosen.detail.value);

    if(this.searchByCantonActivated){
      this.placeService.getPlacesByTagsAndCantons$(this.tagChosen, this.chosenCanton).subscribe(places=>{
        if (places.length == 0) {
          this.data=[];
          this.mapMarkers = [];
          //ouverture popup avec message
          console.log("pas de place pour ce canton")
          /*         this.data = places;
                  this.places = places;
                  this.addDataToMap(); */
        } else {
          console.log("y'a des places")
          this.data = places;
          this.places = places;
          this.addDataToMap();
        }
      })     
    }
    else 
{
    this.placeService.getPlacesByTags$(tagChosen.detail.value).subscribe(places => {
      console.log(places)
      if (places.length == 0) {
        this.mapMarkers = [];
        this.data=[];
        //ouverture popup avec message
        console.log("pas de place pour ce tag")
      } else {
        console.log("places trouvées")
        this.data = places;
        this.places = places;
        this.addDataToMap();
        this.map.setView([46.7985624, 8.2319736], 7  )
      }
    })
  }
  }

  filterByCanton(chosenCanton) {
    this.searchByCantonActivated = true;
    this.chosenCanton = chosenCanton.detail.value;
    console.log(chosenCanton.detail.value)

    if(this.searchByTAgActivated){
      this.placeService.getPlacesByTagsAndCantons$(this.tagChosen, this.chosenCanton).subscribe(places=>{
        if (places.length == 0) {
          this.mapMarkers = [];
          this.data=[];
          //ouverture popup avec message
          console.log("pas de place pour ce canton")
        } else {
          console.log("y'a des places")
          this.data = places;
          this.places = places;
          this.addDataToMap();
        }
      })
      
    }
else 
{
    this.placeService.getPlacesByCantons$(chosenCanton.detail.value).subscribe(places => {
      console.log(places)
      if (places.length == 0) {
        this.mapMarkers = [];
        this.data=[];
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
  }

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
/*     let dropDown = document.getElementById("dropDown");
    dropDown.selectedIndex = 0; */
    this.searchByTAgActivated = false;
    this.searchByCantonActivated = false;
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
   
    const location = await this.map.locate({setView: true, maxZoom: 16});

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
    this.resetMethod();
    this.map.on('click', e => {

      if (this.canActivate==true) {
        
      //this.marker = L.marker(e.latlng).addTo(this.map);
      this.marker = L.marker(e.latlng);
           this.coordinates = this.marker.getLatLng();
        
this.coordinate = [this.coordinates.lat, this.coordinates.lng]

      this.mapOptions.center = this.marker.getLatLng();
      this.map.setView(
        this.marker.getLatLng(),
      )

      setTimeout(() => {
        this.openModal();
      }, 200);
this.canActivate = false;
      
    }
    });
    
  
  
    this.addDataToMap();
  }

activateMapView(){
  console.log("vue map activée");
  this.mapViewChosen = true;
}

activateListView(){
  console.log("vue liste activée")
  this.mapViewChosen = false;
}

toggleView(event){
  console.log("toggle")
  this.mapViewChosen =   !this.mapViewChosen;
}

resetMethod() {
    this.canActivate = true;
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
