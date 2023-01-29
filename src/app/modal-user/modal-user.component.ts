import { Component } from '@angular/core';
import { Validators } from "@angular/forms";
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from "src/app/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modal-example',
  templateUrl: 'modal-user.component.html',
})
export class ModalUserComponent {
  name: string;
  formUser: FormGroup;
public DataUser :any[] = [];
public dataUs: any;
public Tableau: any;
public TableauNom: any;
public compteur = 0;
private pattern = /^[a-zA-Z\sÀ-ÿ-]+$/;
private patternChiffres = /^\d+$/;


  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder, 
    private http: HttpClient,
    private authService: AuthService,
    private AlertController: AlertController,
    
    )
     {
    this.formUser = this.fb.group({
      name: [''],
      surname: [''],
      password: [''],
    });

    //// ici nous voulions faire que cela vérifiait en frontend si le name du user existait déjà, mais nous n'avons
    ///////////// pas réussi pu, car il faut être identifié pour récupérer tous les users
    this.authService.getAllUsers$().subscribe((response) => {
      console.log(response)
      this.Tableau = response;
      console.log(this.Tableau)
      
    })

     }

     async presentAlertName() {
      const alert = await this.AlertController.create({
        header: 'Alerte : échec',
        subHeader: 'Erreur de Name',
        message: "Veuillez entrer un nom d'au moins 3 caractères et qui contient uniquement des lettres",
        buttons: ['OK'],
      });
      await alert.present();
    }

    async presentAlertSurname() {
      const alert = await this.AlertController.create({
        header: 'Alerte : échec',
        subHeader: 'Erreur de Surname',
        message: "Veuillez entrer un nom d'au moins 3 caractères et qui contient uniquement des lettres",
        buttons: ['OK'],
      });
      await alert.present();
    }

    async presentAlertPassword() {
      const alert = await this.AlertController.create({
        header: 'Alerte : échec',
        subHeader: 'Erreur de password',
        message: "Veuillez entrer un password d'au moins 3 caractères ",
        buttons: ['OK'],
      });
      await alert.present();
    }

    async presentAlertUser() {
      const alert = await this.AlertController.create({
        header: 'Succès',
        subHeader: 'Utilisateur créé',
        message: "Bienvenu "+this.dataUs.name,
        buttons: ['OK'],
      });
      await alert.present();
    }
    async presentAlertExist() {
      const alert = await this.AlertController.create({
        header: 'Alerte : échec',
        subHeader: 'Name déjà utilisé',
        message: "Veuillez choisir un autre name ",
        buttons: ['OK'],
      });
      await alert.present();
    }


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {




    this.DataUser.push(this.formUser.value);

    this.dataUs = {
      "name": this.DataUser[0].name,
      "surname": this.DataUser[0].surname,
        "password": this.DataUser[0].password,
    };
    console.log("dataUs")
    console.log(this.dataUs)

    for (let index = 0; index < this.Tableau.length; index++) {
      if(this.dataUs.name==this.Tableau[index].name){
        this.compteur++;
        console.log("compteur"+this.compteur)
      }       
    }

    let result= this.pattern.test(this.dataUs.name)
    let result2= this.pattern.test(this.dataUs.surname)
    let result3= this.pattern.test(this.dataUs.password)
    let resultName= this.patternChiffres.test(this.dataUs.name)
    let resultSurname= this.patternChiffres.test(this.dataUs.surname)


    
    if (this.dataUs.name.length <=2|| result==false|| resultName!=false) {
      this.presentAlertName()
      return this.modalCtrl.dismiss( 'confirm');
      }
      if (this.dataUs.surname.length <=2|| result2==false||resultSurname!=false) {
        this.presentAlertSurname()
        return this.modalCtrl.dismiss( 'confirm');
        }
        if (this.dataUs.password.length <=2|| result3==false) {
          this.presentAlertPassword()
          return this.modalCtrl.dismiss( 'confirm');
          } 
            if(this.compteur==0){
              this.addUser();
              return this.modalCtrl.dismiss('confirm');
            }
            this.presentAlertExist()
            return this.modalCtrl.dismiss('confirm');
          
  }


  addUser() {
    this.authService.addUser$(this.dataUs).subscribe((response) => {
      console.log(response);
      this.presentAlertUser()
      console.log("Utilisateur créé");
    },
    (error) => {
      console.log(error);
      this.presentAlertExist()
      console.log("Utilisateur pas créé car bug");  
    });
  }
}