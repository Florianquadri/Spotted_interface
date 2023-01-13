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
import { latLng, Map, MapOptions, marker, Marker, tileLayer } from 'leaflet';
import { defaultIcon } from '../../default-marker';
import * as L from 'leaflet';
//import 'leaflet-geolocation';


@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements ViewWillEnter {

  mapOptions: MapOptions;
  whichPlace: string;
  
  map: L.Map;
  marker: L.Marker;
  public places: Place[];
  mapMarkers: L.Marker[] = [];
  
  public results = [];
   public data = []; 
   map2: L.Map;
 
   onMapReady(map: Map) {
    setTimeout(() => map.invalidateSize(), 0);
    this.map = map;
    const center = this.map.getCenter();
    this.locateMe();
    this.getMapCurrentPosition();


    this.map.on('click', e => {
      
      this.marker = L.marker(e.latlng).addTo(this.map);

      this.mapMarkers.push(this.marker);
    
      this.mapOptions.center = this.marker.getLatLng();
    this.map.setView( 
      this.marker.getLatLng(),
      
    )

    this.marker.bindPopup("Nouveau marker").openPopup();

    this.mapMarkers.forEach(marker => {
      marker.setIcon(defaultIcon);
    });

 

  console.log(this.mapMarkers);

    });
  }

  getMapCurrentPosition(){
    this.map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;

      const position = e.latlng
      console.log(position);
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


  
/* locateMe() {
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

} */

  constructor( // Inject the authentication provider.
    private auth: AuthService,
    private placeService: PlacesService,
    // Inject the router
    private router: Router) {
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

           this.mapMarkers = [
                 marker([ 46.778186, 6.641524 ], { icon: defaultIcon }).bindPopup('Hello'),
                 marker([ 46.780796, 6.647395 ], { icon: defaultIcon }),
                 marker([ 46.784992, 6.652267 ], { icon: defaultIcon })
               ];
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


  async locateMe() {  
    const location = await this.map.locate({setView: true, maxZoom: 16});

    this.map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;
      marker((e.latlng),{icon: defaultIcon}).addTo(this.map)
          .bindPopup("Vous êtes ici").openPopup();
      // circle(e.latlng, radius).addTo(this.map);
    }
    );

    this.map.on('locationerror', (e) => {
      console.log(e);
      alert(e.message);
    });

  }



  addMarker(){
  
/*     navigator.geolocation.getCurrentPosition(position => {
      this.marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(this.map);
}); */

 // var marker = L.marker(e.latlng).addTo(this.map);

     const marker = L.marker([46.778186, 6.651524]).addTo(this.map);
     
     this.getMapCurrentPosition();


    
        // add the marker to the array
      this.mapMarkers.push(marker);
    
      this.mapOptions.center = marker.getLatLng();
    this.map.setView( 
      marker.getLatLng(),
      16
    )
    marker.bindPopup("Nouveau marker").openPopup();
  


    this.mapMarkers.forEach(marker => {
      marker.setIcon(defaultIcon);
    });
  
  console.log(this.mapMarkers);
  
    }
  
}
