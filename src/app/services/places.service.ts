import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import place pour pouvoir le search
import { Place } from "../models/place";
import { Coordinates } from "../models/coordinates";
import { environment } from "src/environments/environment";
import { ReplaySubject, Observable, of, from, catchError,tap,map } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class PlacesService {

  constructor(private http: HttpClient) {};

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getPlaces$(): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places`);
  }
  getPlacesByUserId$(userId): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/users/${userId}/visitedPlaces`);
  }

/*   getPlacesId$(placeId): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?placeId=${placeId}`);
  } */

  getPlacesByCantons$(canton): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?canton=${canton}`);
  }


  addPlace$(data: any[]){ 

    return this.http.post(`${environment.apiUrl}/places`, data);
    
  }

  

addPicture$(picture: any[],placeId){
  return this.http.post(`${environment.apiUrl}/places?placeId=${placeId}/pictures`, picture);
}

  handleError<T>(arg0: string): (err: any, caught: Observable<any>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }
  
  getCoordinatesForCantons$(canton): Observable<Coordinates> {
    return this.http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${canton}.json?types=region&country=CH&access_token=sk.eyJ1IjoiZmxvd29uZTk2IiwiYSI6ImNsY3l1cDZldzAwOTIzd3JsMmQ2dTVuNzkifQ.dx-pUyyCbKM99Paxg8OzuA`)
    .pipe(
      map((obj) => obj.features[0].center));
  }

  getPlacesByTags$(tag): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?tag=${tag}`);
  }

  getPlacesByTagsAndCantons$(tag, canton): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?tag=${tag}&canton=${canton}`);
  }

}