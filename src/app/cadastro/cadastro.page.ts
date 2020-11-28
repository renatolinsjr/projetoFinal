import { AutenticacaoService} from './../services/autenticacao/autenticacao.service';
import { ToastsService } from '../services/toast/toasts.service';
import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { User } from './../models/user';

@Component({
  selector: 'cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  userModel: User;

  constructor(
    public autenticacaoService: AutenticacaoService,
    private toastServ: ToastsService,
    private navegacao: NavController,
    private storage: Storage,
    public router: Router
  ){
    this.userModel = new User();
  }

  ngOnInit() {
  }

  insereUsuario(){
    
    if(this.userModel.senha == this.userModel.senha2){
      this.autenticacaoService.insereNofireBase(this.userModel.email, this.userModel.senha)
      .then((res)=>{
        if(res){
          console.log('ResUser: ', res);
          let uid = res.user.uid;
          this.autenticacaoService.createProfile(this.userModel, uid);
          this.userModel = new User();
          this.storage.set('userUID', res.user.uid);
          this.toastServ.toastMsg('Cadastrado com sucesso!');
          this.router.navigateByUrl('app/tabs/tab3');
        }else{
          this.toastServ.toastMsg('Preencha os campos corretamente.');
          this.router.navigate(['/login']);
        }
        this.userModel = new User();
      }).catch((err)=>{
        this.toastServ.toastMsg('Preencha os campos corretamente.');
      });
    }else{
      this.toastServ.toastMsg('Senha divergentes!');
    }
  }

  loginPage() {
    this.navegacao.navigateForward('login')
  }
  
}
