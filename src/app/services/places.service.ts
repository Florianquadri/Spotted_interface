import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import place pour pouvoir le search
import { Place } from "../models/place";
import { Note } from "../models/note";
import { Coordinates } from "../models/coordinates";
import { environment } from "src/environments/environment";
import { ReplaySubject, Observable, of, from, catchError,tap,map } from "rxjs";
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})

export class PlacesService {
public values;

  constructor(private http: HttpClient) {};

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getPlacesById$(id): Observable<Place> {
    return this.http.get<Place>(`${environment.apiUrl}/places/${id}`);
  }

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

  addNote$(data : Note, placeId){ 
    return this.http.post(`${environment.apiUrl}/places/${placeId}/notes`, data);
    }


  addPicture$(picture: File,placeId){
    console.log("picture")
    console.log(picture) 
    /* console.log("placeId")
    console.log(placeId )  */
    
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'image/png');
    const options = { headers: headers, responseType: 'text' as const}

    const formData = new FormData();
    formData.append("place", placeId);
    formData.append("picture", picture);
    console.log(" Formadata de ")
   /*  console.log(formData.get('place')) */
    console.log(formData.get('picture'))
  
      

    return this.http.post(`${environment.apiUrl}/pictures`, formData, options)

  }

  


  addPictureToPlace$(picture: File,placeId){
    const formData = new FormData();
    formData.append("picture", picture);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    const options = { headers: headers, responseType: 'text' as const}
    return this.http.post(`${environment.apiUrl}/places/${placeId}/pictures`, formData, options)
  }


/* addPicture$(picture: any[],placeId){
  return this.http.post(`${environment.apiUrl}/places?placeId=${placeId}/pictures`, picture);
} */

  handleError<T>(arg0: string): (err: any, caught: Observable<any>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }
  
  getCoordinatesForCantons$(canton): Observable<Coordinates> {
    //gère 2 cas spéciaux liés à Bâle
    if(canton == "Bâle-campagne"){canton = "Basel-Landschaft"} else if(canton == "Bâle-ville"){canton = "Basel-Stadt"}
    return this.http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${canton}.json?types=region&country=CH&access_token=sk.eyJ1IjoiZmxvd29uZTk2IiwiYSI6ImNsY3l1cDZldzAwOTIzd3JsMmQ2dTVuNzkifQ.dx-pUyyCbKM99Paxg8OzuA`)
    .pipe(
      map((obj) => obj.features[0].center));
  }

  getCantonsByCoordinates$(latitude, longitude): Observable<any> {
    return this.http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=region&language=fr&tcountry=CH&access_token=sk.eyJ1IjoiZmxvd29uZTk2IiwiYSI6ImNsY3l1cDZldzAwOTIzd3JsMmQ2dTVuNzkifQ.dx-pUyyCbKM99Paxg8OzuA`)
    .pipe(
      map((obj) => obj.features[0].text));
  }

  getPlacesByTags$(tag): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?tag=${tag}`);
  }

  getPlacesByTagsAndCantons$(tag, canton): Observable<Place[]> {
    return this.http.get<Place[]>(`${environment.apiUrl}/places?tag=${tag}&canton=${canton}`);
  }

  patchPlace$(placeId: string, updates: any){
    return this.http.patch(`${environment.apiUrl}/places/${placeId}`, updates)
  }

}