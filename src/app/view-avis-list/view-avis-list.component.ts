import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../auth/auth.service'
import { NotesService } from 'src/app/services/notes.service';

@Component({
  selector: 'app-view-avis-list',
  templateUrl: './view-avis-list.component.html',
  styleUrls: ['./view-avis-list.component.scss'],
})
export class ViewAvisListComponent implements OnInit {
  public avis : any;
  public whoIsConnected : string;

  constructor(private route: ActivatedRoute, private AuthService: AuthService, private NotesService : NotesService) { }

  ngOnInit() {

    this.avis = JSON.parse(this.route.snapshot.paramMap.get('param'));
    console.log(this.avis)

this.AuthService.getUser$().subscribe((resp)=>{
console.log(resp)
this.whoIsConnected = resp._id;
console.log(this.whoIsConnected)
    })
  }

  deleteNote(idNote, idPlace){
    this.NotesService.deleteNotes$(idNote, idPlace).subscribe((resp)=>{
      console.log(resp)
    })
console.log(idNote)
  }

}
