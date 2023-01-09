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
import { latLng, MapOptions, tileLayer, Map, marker, Marker} from 'leaflet';
import { defaultIcon } from '../../utile_files/default-marker';
import { locateMeIcon } from '../../utile_files/locateMe-marker';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements ViewWillEnter {

  whichPlace: string;
  public places: Place[];
  public results = [];
  public data = [];
  mapOptions: MapOptions;
  mapMarkers: Marker[];
  map : Map;



  handleChange(event) {
    const query = event.target.value.toLowerCase();
    if (query == "") {
      this.results = [];
    } else {
      this.results = this.data.filter(d => d.name.toLowerCase().indexOf(query) > -1);
      console.log(this.results)
    }

  }

  onMapReady(map: Map) {
    setTimeout(() => map.invalidateSize(), 0);
    this.map = map;
    const center = this.map.getCenter();
    this.locateMe();
  }
  
locateMe() {
  this.map.locate({setView: true, maxZoom: 16});

  this.map.on('locationfound', (e) => {
    const radius = e.accuracy / 2;
    marker((e.latlng),{icon: locateMeIcon}).addTo(this.map)
        .bindPopup("Vous êtes ici").openPopup();
    // circle(e.latlng, radius).addTo(this.map);
  }
  );

  this.map.on('locationerror', (e) => {
    console.log(e);
    alert(e.message);
  });

}

  constructor( // Inject the authentication provider.
    private auth: AuthService,
    private placeService: PlacesService,
    // Inject the router
    private router: Router) { 

      this.mapMarkers = [
        marker([ 46.778186, 6.641524 ], { icon: defaultIcon }),
        marker([ 46.780796, 6.647395 ], { icon: defaultIcon }),
        marker([ 46.784992, 6.652267 ], { icon: defaultIcon })
      ];

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


  ionViewWillEnter(): void {
    // Make an HTTP request to retrieve the trips.
    this.placeService.getPlaces$().subscribe(places => {
      console.log(places)
      this.places = places;
      this.data = places;
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
