import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import place pour pouvoir le search
import { Place } from "../models/place";
import { environment } from "src/environments/environment";
import { ReplaySubject, Observable, from } from "rxjs";

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

  
}