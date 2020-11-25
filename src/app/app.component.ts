import { AutenticacaoService } from './services/autenticacao/autenticacao.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  about: boolean = true;
  myName: any;

  constructor(
    private authService: AutenticacaoService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private platform: Platform,
    private storage: Storage,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide(); 
      }, 1800);
    });
  }

  ngOnInit() {
    this.getUserName();
  }

  getUserName(){
    this.storage.get('userProfile').then((userProf)=>{
      if(userProf!=undefined){
        this.myName = userProf.name;
      }else{
        this.myName = 'Seja bem vind@'
      }
    });
  }

  perfil(){
    this.about = true;
    this.router.navigateByUrl(`/perfil`);
  }

  autoavaliacao(){
    this.about = true;
    this.router.navigateByUrl(`/autoavaliacao`);
  }

  local(){
    this.about = true;
    this.router.navigateByUrl('app/tabs/tab3');
  }

  showSobre(){
    this.about=this.about?false:true;
  }

  logout(){
    this.about = true;
    this.authService.logout().then((res) => {
      this.router.navigate(['/login']);
    });
  }
}
