import { LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  loading;
  isLoading;

  constructor(
    public loadCtrl: LoadingController
  ){    
  }

  async presentLoad(msg){
    this.isLoading = true;
    return await this.loadCtrl.create({
      spinner: 'bubbles',
      message: msg,
      translucent: true,
      cssClass: 'custom-loader-class',
      backdropDismiss: true
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('Abort loading'));
        }
      });
    });
  }

  async dismissLoad(){
    this.isLoading = false;
    return await this.loadCtrl.getTop().then(a => {
        if ( a )
        a.dismiss().then(() => console.log('Loading dismissed'));
    });
  }

}
