import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import place pour pouvoir le search
import { Place } from "../models/place";
import { Coordinates } from "../models/coordinates";
import { environment } from "src/environments/environment";
import { ReplaySubject, Observable, from, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PlacesService {

  constructor(private http: HttpClient) {
  };

  getPlaces$(): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places`);
  }

  getPlacesByCantons$(canton): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?canton=${canton}`);
  }

  getCoordinatesForCantons$(canton): Observable<Coordinates> {
    return this.http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${canton}.json?types=region&country=CH&access_token=sk.eyJ1IjoiZmxvd29uZTk2IiwiYSI6ImNsY3l1cDZldzAwOTIzd3JsMmQ2dTVuNzkifQ.dx-pUyyCbKM99Paxg8OzuA`)
    .pipe(
      map((obj) => obj.features[0].center));
  }

  
}