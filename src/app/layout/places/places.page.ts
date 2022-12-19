import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
// TODO: import Angular's HTTP client.
import { HttpClient } from "@angular/common/http";
import { ViewWillEnter } from "@ionic/angular";

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
})
export class PlacesPage implements ViewWillEnter {

  constructor( // Inject the authentication provider.
    private auth: AuthService,
    public http: HttpClient,
    // Inject the router
    private router: Router) { }
    ionViewWillEnter(): void {
      // Make an HTTP request to retrieve the trips.
      const url = "https://spotted-rest-api.onrender.com/places";
      this.http.get(url).subscribe((users) => {
        console.log(`Places`, users);
      });
    }

  ngOnInit() {
  }

  logOut() {
    console.log("logging out...");
    this.auth.logOut();
    this.router.navigateByUrl("/login");
  }

}
