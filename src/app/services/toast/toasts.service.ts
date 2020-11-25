import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(
    public toastCtrl: ToastController,    
  ){
  }

  async toastMsg(msg){
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2400,
      position: 'middle',
      cssClass: 'toast-message'
    });
    toast.present();
  }
}
