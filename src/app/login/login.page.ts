import { AutenticacaoService } from './../services/autenticacao/autenticacao.service';
import { ToastsService } from '../services/toast/toasts.service';
import { MenuController, NavController} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mensagem:string='';
  email:string='';
  senha:string='';
  
  constructor(
    public autenticacaoService: AutenticacaoService,
    private menuCtrl: MenuController,
    private toastServ: ToastsService,
    private navegacao:NavController,
    private storage: Storage,
    public router:Router
  ){
    this.loginUsuario();
  }

  ngOnInit() {
    this.loginUsuario();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
    this.emptiesUser();
  }

  loginUsuario(){
    this.autenticacaoService.loginNoFirebase(this.email, this.senha)
    .then((res) =>{
      console.log('userUID: ', res.user.uid);
      this.storage.set('userUID', res.user.uid);
      this.navegacao.navigateForward('app/tabs/tab3');    
    }).catch((error)=>{
      this.toastServ.toastMsg('Autentique-se!');
      this.navegacao.navigateForward('/login');      
    });
  }

  emptiesUser(){
    this.email='';
    this.senha='';
  }

  cadastroPage(){
    this.navegacao.navigateForward('cadastro');
  }

}
