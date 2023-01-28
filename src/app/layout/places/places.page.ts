import { PlaceModalComponentComponent } from './../../place-modal-component/place-modal-component.component';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
// TODO: import Angular's HTTP client.
import { HttpClient } from '@angular/common/http';
import { ViewWillEnter } from 'node_modules/@ionic/angular';
import { environment } from 'src/environments/environment';
import { NotesService } from 'src/app/services/notes.service';
import { PlacesService } from 'src/app/services/places.service';
import { Place } from 'src/app/models/place';
import { Coord } from 'src/app/models/coord';
import { FormsModule } from '@angular/forms';
import { Note } from 'src/app/models/note';
import { latLng, MapOptions, tileLayer, Map, marker, Marker } from 'leaflet';
import { defaultIcon } from '../../utile_files/default-marker';
import { locateMeIcon } from '../../utile_files/locateMe-marker';
import * as L from 'leaflet';
import { ModalController } from 'node_modules/@ionic/angular';
import { AddPlaceComponent } from '../../add-place/add-place.component';
import { catchError } from 'rxjs/operators'
import distance from 'node_modules/@turf/distance';
import { points, Units } from 'node_modules/@turf/helpers';

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
  public from: Coord[];
  public to: Coord[];
  public options = {  units: 'kilometers' as Units};
  public distanceWithMe = [];
  public whereIam: any;
  public wherIamCoordinates: any;


  message =
    'This modal example uses the modalController to present and dismiss modals.';
  chosenPlace: Place;
  chosenCanton: string;
  tagChosen: string;
  //comment réinitialiser champ menu déroulant ?
  //pour savoir si un filtre est déjà activé et s'il faut ainsi les mixer
  mapViewChosen: boolean = true;

  public cantons = [
    /* "Tous", */ 'Appenzell rhodes-extérieures'/* marche pas jsp pq */,
    'Appenzell rhodes-intérieures',
    'Argovie',
    'Bâle-campagne'/* à régler */,
    'Bâle-ville'/* à régler */,
    'Berne',
    'Fribourg',
    'Genève',
    'Glaris',
    'Grisons',
    'Jura',
    'Lucerne',
    'Neuchâtel',
    'Nidwald',
    'Obwald',
    'St. galles'/* ok */,
    'Schaffhausen'/* exception car envoi Schaffhouse OK */,
    'Schwytz',
    'Soleure',
    'Ticino' /* exception car envoi Tessin OK*/,
    'Thurgovia'/* exception car envoi Thurgovie OK */,
    'Uri',
    'Valais',
    'Vaud',
    'Zug'/* exception car envoi Zoug OK */,
    'Zurich',
  ];

  public tags = [
    'Piscine',
    'forêt',
    'trébo',
    'street photography',
    'lac',
    'montagne',
    'sunrise',
    'sunset',
    'treck',
    'monument',
    'panorama',
    'urbex',
    'glacier',
    'barrage',
    'incontournable',
    'astrophotographie',
    'lost but worth it',
  ];

  constructor(
    // Inject the authentication provider.
    private auth: AuthService,
    private placeService: PlacesService,
    private noteService: NotesService,

    // Inject the router
    private router: Router,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {
    this.mapOptions = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
        }),
      ],
      zoom: 13,
      center: latLng(46.778186, 6.641524),
    };
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddPlaceComponent,
      componentProps: { coordinates: this.coordinate },
      
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }

    modal.onDidDismiss().then((data) => {
      this.marker.addTo(this.map);
      this.mapMarkers.push(this.marker);
      this.mapMarkers.forEach((marker) => {
        marker.setIcon(defaultIcon);
      });
      /* console.log(this.mapMarkers); */
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
    this.distanceWithMe = [];
    for (let i = 0; i < this.data.length; i++) {
      //const e = this.data[i];
      /* console.log(     this.data[i].location.coordinates) */
      const marker = L.marker(
        [
          this.data[i].location.coordinates[0],
          this.data[i].location.coordinates[1],
        ],
        { icon: defaultIcon }
      );
      await marker.on('click', () => this.displayPlaceModal(this.data[i]));
      this.mapMarkers.push(marker);

      //calculer distance entre chaque point recherché et notre position
      this.calculeDist(this.data[i].location.coordinates,i);

    }
    console.log(this.mapMarkers);

  }

  calculeDist(coordPlace : any, i : any) {

    const distancePoint = distance([coordPlace[1], coordPlace[0]], this.wherIamCoordinates, this.options)
    const distArrondie = distancePoint.toFixed(2)
/*     console.log(distArrondie); */
this.data[i].distanceWithMe = distArrondie;
    this.distanceWithMe.push(distArrondie);
/*     console.log(this.data[i]) */
/*     console.log(this.distanceWithMe) */
  }

  async displayPlaceModal(place: []) {
    const modal = await this.modalCtrl.create({
      component: PlaceModalComponentComponent,
      componentProps: { data: place },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }

  getMapCurrentPosition() {
    this.map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;

      const position = e.latlng;
    });
  }

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    if (query == '') {
      this.results = [];
    } else {
      this.results = this.data.filter(
        (d) => d.name.toLowerCase().indexOf(query) > -1
      );
      console.log(this.results);
    }
  }

  goOnChosenPoint(chosenPlace) {
    console.log(chosenPlace.location.coordinates);
    this.map.setView(
      [
        chosenPlace.location.coordinates[0],
        chosenPlace.location.coordinates[1],
      ],
      13
    );
    this.results = [];
  }


  filterByTag() {
    console.log(this.tagChosen);

    if (this.chosenCanton) {
      this.placeService
        .getPlacesByTagsAndCantons$(this.tagChosen, this.chosenCanton)
        .subscribe((places) => {
          if (places.length == 0) {
            this.data = [];
            this.mapMarkers = [];
            //ouverture popup avec message
            console.log('pas de place pour ce canton');
            /*         this.data = places;
                  this.places = places;
                  this.addDataToMap(); */
          } else {
            console.log("y'a des places");
            this.data = places;
            this.places = places;
            this.addDataToMap();
          }
        });
    } else {
      this.placeService.getPlacesByTags$(this.tagChosen).subscribe((places) => {
        console.log(places);
        if (places.length == 0) {
          this.mapMarkers = [];
          this.data = [];
          //ouverture popup avec message
          console.log('pas de place pour ce tag');
        } else {
          console.log('places trouvées');
          this.data = places;
          this.places = places;
          this.addDataToMap();
          this.map.setView([46.7985624, 8.2319736], 7);
        }
      });
    }
  }

  filterByCanton() {
    console.log(this.chosenCanton);

    if (this.tagChosen) {
      this.placeService
        .getPlacesByTagsAndCantons$(this.tagChosen, this.chosenCanton)
        .subscribe((places) => {
          if (places.length == 0) {
            this.mapMarkers = [];
            this.data = [];
            //ouverture popup avec message
            console.log('pas de place pour ce canton');
          } else {
            console.log("y'a des places");
            this.data = places;
            this.places = places;
            this.addDataToMap();
          }
        });
    } else {
      this.placeService
        .getPlacesByCantons$(this.chosenCanton)
        .subscribe((places) => {
          console.log(places);
          if (places.length == 0) {
            this.mapMarkers = [];
            this.data = [];
            //ouverture popup avec message
            console.log('pas de place pour ce canton');
            /*         this.data = places;
                this.places = places;
                this.addDataToMap(); */
          } else {
            console.log("y'a des places");
            this.data = places;
            this.places = places;
            this.addDataToMap();
            console.log('test', this.data);
            //zoomer sur coordonnées centrales du canton + zoom plus vaste
          }
        });
    }

    if (this.chosenCanton) {
      this.placeService
        .getCoordinatesForCantons$(this.chosenCanton)
        .subscribe((coordinates) => {
          console.log(coordinates);
          this.map.setView([coordinates[1], coordinates[0]], 8);
          /*         this.mapOptions.zoom = 10; */
        });
    }
  }

  reinitialiseFiltres() {
    /*     let dropDown = document.getElementById("dropDown");
    dropDown.selectedIndex = 0; */
    this.chosenCanton = undefined;
    this.tagChosen = undefined;
    //penser à réinitialiser si appui sur bouton réinitialiser
    this.placeService.getPlaces$().subscribe((places) => {
      //console.log(places)
      this.places = places;
      this.data = places;
      this.addDataToMap();
      this.locateMe();
      /* console.log(this.data) */

    });
  }

  async locateMe() {
    const location = await this.map.locate({ setView: true, maxZoom: 16 });

    this.map.on('locationfound', (e) => {
      this.wherIamCoordinates = [e.latlng.lng, e.latlng.lat];
      /*       this.whereIam = e.latlng; */
      /*       console.log(e.latlng) */
      console.log(this.wherIamCoordinates)
      const radius = e.accuracy / 2;
      marker(e.latlng, { icon: locateMeIcon })
        .addTo(this.map)
        .bindPopup('Vous êtes ici')
        .openPopup();
      // circle(e.latlng, radius).addTo(this.map);
    });

    this.map.on('locationerror', (e) => {
      console.log(e);
      alert(e.message);
    });
  }

  viewInfoPlace(data){
    this.displayPlaceModal(data);

  }

  addMarker() {
    this.resetMethod();
    this.map.on('click', (e) => {
      if (this.canActivate == true) {
        //this.marker = L.marker(e.latlng).addTo(this.map);
        this.marker = L.marker(e.latlng);
        this.coordinates = this.marker.getLatLng();

        this.coordinate = [this.coordinates.lat, this.coordinates.lng];

        this.mapOptions.center = this.marker.getLatLng();
        this.map.setView(this.marker.getLatLng());

        setTimeout(() => {
          this.openModal();
        }, 200);
        this.canActivate = false;
      }
    });

    this.addDataToMap();
  }

  activateMapView($event) {
    console.log('vue map activée');
    this.mapViewChosen = true;
  }

  activateListView($event) {
    console.log('vue liste activée');
    this.mapViewChosen = false;
  }

  toggleView(event) {
    console.log('toggle');
    this.mapViewChosen = !this.mapViewChosen;
  }

  resetMethod() {
    this.canActivate = true;
  }

  viewAvisForThisPlace(avisPlace) {
    this.router.navigate(
      ['./view-avis-list', { param: JSON.stringify(avisPlace) }],
      { relativeTo: this.route }
    );
  }

  oneventShowListOfAvis(event) { console.log(event); }

  ionViewWillEnter(): void {
    // Make an HTTP request to retrieve the trips.
    this.placeService.getPlaces$().subscribe((places) => {
      //console.log(places)
      this.places = places;
      this.data = places;

      let placeId = null;

      for (const place of places) {
        this.noteService.getNotes$(place._id)
          .subscribe((notes) => {
            place.averageNote =
              notes.length > 0
                ? notes.reduce((total, note) => (total += note.stars), 0) /
                notes.length
                : undefined;
          }, (error) => {
/*             console.log("y a un souci de pas de notes"); */
          });
      }



      this.addDataToMap();
      /* console.log(this.data)
      console.log(this.data[4]) */
    });
  }

  logOut() {
    console.log('logging out...');
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }
}
