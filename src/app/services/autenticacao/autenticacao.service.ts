import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { User } from './../../models/user';
import { Storage } from '@ionic/storage';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
  
})
export class AutenticacaoService {

  user: User;

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private storage: Storage
  ){    
  }
  
  async loginNoFirebase(email, password){
    return await this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  async insereNofireBase(email, password){
    return await this.fireAuth.createUserWithEmailAndPassword(email, password)
  }

  async recoverPsw(email) {
    return await this.fireAuth.sendPasswordResetEmail(email);
  }

  async getCurrentUser(){
    return await this.fireAuth.authState.pipe(first()).toPromise();
  }
  
  async createProfile(user: User, uid) {
    return await this.firestore.collection('Users')
    .doc(uid).set(
    {
      createdAt: Date.now(),
      id: uid,
      name: user['name'],
      email: user['email'],
      senha: user['senha'],
      class: {
        class: user['class'] || 'Ainda não classificado!',
        lat: user['lat'] || 0,
        lng: user['mng'] || 0,
      },
      covid: {
        'covid': user['covid'] || 'Não definido...',
        'idade': user['idade'] || 'Não definido...',
        'risco': user['risco'] || 'Não definido...',
        'sintomas': user['sintomas'] || 'Não definido...',
        'teve': user['teve'] || 'Não definido...'
      },
      updatedAt: Date.now()
    }
    ).catch((error)=>{
      console.log('Error: ', error);
    });
  }

  async logout() {
    return await this.fireAuth.signOut().then(() => {
      // this.storage.remove('userProfile');
      this.storage.remove('userUID');
      console.log('Usuário saiu...');
    });
  }

}
