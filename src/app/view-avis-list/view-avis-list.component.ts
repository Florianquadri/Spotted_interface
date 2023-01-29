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
  public avis: any;
  public whoIsConnected: string;

  constructor(private route: ActivatedRoute, private AuthService: AuthService, private NotesService: NotesService) { }

  ngOnInit() {

    this.avis = JSON.parse(this.route.snapshot.paramMap.get('param'));
    console.log(this.avis)

    this.AuthService.getUser$().subscribe((resp) => {
      console.log(resp)
      this.whoIsConnected = resp._id;
      console.log(this.whoIsConnected)
    })
  }

  getNotes() {
    console.log(this.avis)
    // Make an HTTP request to retrieve the trips.
    this.NotesService.getNotes$(this.avis[0].place).subscribe((notes) => {
      this.avis = [];
      for (let oneNote of notes) {
        console.log(oneNote)
        if (oneNote.text) {
          this.avis.push({ "text": oneNote.text, "author": oneNote.author, "id": oneNote._id, "place": oneNote.place })
        }
      }
      console.log(this.avis)
/*       this.arrayCommentsLength = this.data.commentaire.length; */

    });
  }



  deleteNote(idNote, idPlace) {
    console.log("je tente de supprimer la note", idNote, "de la place", idPlace)
    this.NotesService.deleteNotes$(idNote, idPlace).subscribe((resp) => {
      console.log("1")
      console.log(resp, "bien supprimé")
      console.log("2")
      this.getNotes();
      console.log("1")
      console.log(idNote)
    })

  }

}
