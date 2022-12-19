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
 


  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter(d => d.name.toLowerCase().indexOf(query) > -1);
    console.log(this.results)
  }

  constructor( // Inject the authentication provider.
    private auth: AuthService,
    private placeService: PlacesService,
    // Inject the router
    private router: Router) { }


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
