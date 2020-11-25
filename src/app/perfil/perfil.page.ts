import { UsersService } from './../services/users/users.service';
import { LoadService } from '../services/loading/load.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from "@ionic/angular";
import { Storage } from '@ionic/storage';
import { User } from './../models/user';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  tempUser;
  userName;
  model: User = {
    name: '',
    email: '',
    senha: '',
    senha2:'',
    class: {
      class: 0
    },
    covid: {
      covid: 0,
      transp: 0,
      risco: 0,
      sintomas: 0,
      teve: 0,
      rangeMask: 0,
      rangeAlcool: 0,
      rangeLavam: 0,
      rangeDist: 0,
      rangeSocial: 0,
      rangeMedo: 0,
      rangePessoas: 0,
      rangeFamilia: 0
    }
  };
	userUID: any;
  showClass: boolean = false;
  customAlertOptions: any = {
    subHeader: 'Selecione uma opção'
  };
  classificaCor:string='';
  myClassification;
  rangeMe: number = 0;
  aceptTermos: boolean = false;
  seeTermos: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    public loadingServ: LoadService,
    private userServ: UsersService,
    private storage: Storage
  ){    
    this.getUserUID();
    this.model = new User();
  }
  
  ngOnInit(){  
    // 1 unica vez
  }

  ionViewDidLeave() {
  }

  seeClassification(){
    this.showClass=this.showClass?false:true;
  }

  lerTermos(){
    this.seeTermos=this.seeTermos?false:true;
  }

  aceitarTermos(){
    this.aceptTermos=this.aceptTermos?false:true;
  }

  getUserUID() {
    this.storage.get('userUID').then((uid)=>{
      if(uid!=undefined){
        this.userUID = uid;
      }
      console.log('$UID: ', this.userUID);
    }).then(()=>{
      this.getUserProfile(this.userUID);
    });
  }
  
  getUserProfile(uid){
    this.loadingServ.presentLoad('Carregando...');
    if(uid!=undefined){
      this.userServ.getUserProfile(uid).then((userDoc) => {
        if (userDoc.exists) {
          this.tempUser = userDoc.data();
          this.model = this.tempUser;
          this.storage.set('userProfile', this.tempUser);
          if(this.model['class']['class']!=null){
            this.userServ.setRiscoColor(this.model['class']['class']).then((resCor)=>{
              this.classificaCor = resCor.classificaCor;
            });
          }
        } else {
          console.log('Sem dados User!');
        }
        this.loadingServ.dismissLoad();
      }), retry(3);
    }else{
      console.log('userUID == undefined!');
      this.loadingServ.dismissLoad();
    }
  }

  editProfile(model) {
    let dataUser = {
      id: this.userUID,
      createdAt: model['createdAt'] || Date.now(),
      name: model['name'],
      email: model['email'],
      senha: model['senha'],
      class: {
        class: model['class'] || 0
      },
      updatedAt: Date.now()
    }
   const isPasswordEqual = model['senha'] === model['senha2'];
    if(isPasswordEqual) {
        this.updateProfile(this.userUID, dataUser);
    } else {
        this.showAlert('Senhas divergentes!')
    } 
  }

  saveClass(model: User){
    console.log('User Class:', model);
    this.userServ.calcRisco(model).then((riscoUser)=>{
      console.log('calcRisco:', riscoUser);
      let dataUser = {
        createdAt: model['createdAt'] || Date.now(),
        id: this.userUID,
        name: model['name'],
        email: model['email'],
        senha: model['senha'],
        class: {
          class: riscoUser
        },
        covid: {
          'covid': model['covid']['covid'] || 0,
          'transp': model['covid']['transp'] || 0,
          'risco': model['covid']['risco'] || 0,
          'sintomas': model['covid']['sintomas'] || 0,
          'teve': model['covid']['teve'] || 0,
          'rangeMask': model['covid']['rangeMask'] || 0,
          'rangeAlcool': model['covid']['rangeAlcool'] || 0,
          'rangeLavam': model['covid']['rangeLavam'] || 0,
          'rangeDist': model['covid']['rangeDist'] || 0,
          'rangeSocial': model['covid']['rangeSocial'] || 0,
          'rangeMedo': model['covid']['rangeMedo'] || 0,
          'rangePessoas': model['covid']['rangePessoas'] || 0,
          'rangeFamilia': model['covid']['rangeFamilia'] || 0,
        },
        updatedAt: Date.now()
      }    
      this.updateProfile(this.userUID, dataUser);    
    });
  }

  updateProfile(uid, dataUser){
    this.loadingServ.presentLoad('Salvando...');
    this.userServ.updateProfile(uid, dataUser)    
    .then(res => {
      this.getUserProfile(uid);
      this.loadingServ.dismissLoad();
      this.showAlert('Perfil atualizado com sucesso!');
      this.aceptTermos = false;
      this.showClass = false;
    });
  }

  async showAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: '',
      message: msg,
      cssClass: 'alert-custom-class',
      animated: true,
      buttons: ['Entendi']
    });
    await alert.present();
  }
}
