import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import place pour pouvoir le search
import { Note } from "../models/note";
import { environment } from "src/environments/environment";
import { ReplaySubject, Observable, from } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) {}

   getNotes$(placeId): Observable<Note[]> {
    return this.http.get<Note[]>(`${environment.apiUrl}/places/${placeId}/notes`);

  }

  getAverageNoteForAPlace$(placeId): any {
    return this.http.get<any>(`${environment.apiUrl}/places/${placeId}/score`);

  }

  deleteNotes$(noteId : string, placeId : string){
    return this.http.delete(`${environment.apiUrl}/places/${placeId}/notes/${noteId}`);
  }
  

}
