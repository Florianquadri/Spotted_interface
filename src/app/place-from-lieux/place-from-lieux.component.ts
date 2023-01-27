import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotesService } from '../services/notes.service';
import { Place } from '../models/place';
import { SharedModule } from '../shared/shared.module';


@Component({
  selector: 'app-place-from-lieux',
  templateUrl: './place-from-lieux.component.html',
  styleUrls: ['./place-from-lieux.component.scss'],
})
export class PlaceFromLieuxComponent implements OnInit {
  public place: Place;
  public notes = null;
  public notesTraitees = null;
  public pageName ="placeDetail";
  public dataPlaceFromLieux;

  constructor(private route: ActivatedRoute,
    private noteService: NotesService) { 
    }

  ngOnInit() {
    this.place = JSON.parse(this.route.snapshot.paramMap.get('param'));
    this.noteService.getNotes$(this.place._id);
    this.dataPlaceFromLieux=this.place._id
  }

  ionViewWillEnter(): void {
    
     console.log(this.place);
      this.noteService.getNotes$(this.place._id).subscribe(e => {
        this.notes = e;
          this.notesTraitees=this.notes[0].stars
        
      });
  }
}
