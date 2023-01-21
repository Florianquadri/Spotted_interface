import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import place pour pouvoir le search
import { Place } from "../models/place";
import { environment } from "src/environments/environment";
import { ReplaySubject, Observable, of, from, catchError,tap } from "rxjs";
import { FormGroup } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';

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

  getPlacesByCantons$(canton): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?canton=${canton}`);
  }

/*   postPlace$(): Observable<placeInfos[]>{
    return this.http.post<placeInfos[]>(`${environment.apiUrl}/places/placeId`);
  } */

  addPlace(data){ 
    
    return this.http.post(`${environment.apiUrl}/places`, data)
   // return this.http.post(`${environment.apiUrl}/places`, { data$, coordinate });
  
  
  }


/*   add(data: any, marker: L.Marker) {
    const location = marker.getLatLng();
    return this.http.post(`${environment.apiUrl}/places`, { data, location });
  } */

  handleError<T>(arg0: string): (err: any, caught: Observable<any>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }
  
}