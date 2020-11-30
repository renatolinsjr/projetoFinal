import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  resClassification = {
    classificaCor:'',
    myClassification:''
  }
  userUID;

  constructor(
    private firestore: AngularFirestore,
    private storage: Storage
  ){
    this.getUserUID();
  }

  getUserUID() {
    this.storage.get('userUID').then((uid)=>{
      this.userUID = uid;
    });
  }

  getUserProfile(userId: string) {
    return this.firestore.collection('Users').doc(userId).ref.get();
  }

  getUserDetails(userID) {
    console.log('getUserDetails(userID) ', userID);
    return this.firestore.collection('Users', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.where('id', '==', userID);
      console.log('MyQuery: ', query);
      return query;
    }).snapshotChanges();
  }

  async updateProfile(userID, dataUser){
    return await this.firestore.doc('Users/' + userID).update(dataUser);
  }

  async updateFavorites(userID, dataUser){
    return this.firestore.collection('Users').doc(userID).set(dataUser)
  }

  async calcRisco(dataUser: User){
    // desestruturação (destructuture)
    const [covid, transp, risco, sintomas, teve] = [dataUser.covid.covid, dataUser.covid.transp, dataUser.covid.risco, dataUser.covid.sintomas, dataUser.covid.teve];
    const [rangeMask, rangeAlcool, rangeLavam, rangeDist] = [dataUser.covid.rangeMask, dataUser.covid.rangeAlcool, dataUser.covid.rangeLavam, dataUser.covid.rangeDist]
    const [rangeSocial, rangeMedo, rangePessoas, rangeFamilia] = [dataUser.covid.rangeSocial, dataUser.covid.rangeMedo, dataUser.covid.rangePessoas, dataUser.covid.rangeFamilia]

    let sum1 = (covid*2)+(transp*2)+(risco*2)+(sintomas*1)+(teve*1);
    let sum2 = (rangeMask*1)+(rangeAlcool*1)+(rangeLavam*1)+(rangeDist*1);
    let sum3 = (rangeSocial*1)+(rangeMedo*1)+(rangePessoas*0.1)+(rangeFamilia*0.3);
    let classUser = (sum1+sum2+sum3)/3;

    this.setRiscoColor(classUser);
    return classUser;
  }

  async setRiscoColor(classUser) {
    if (classUser >= 12.1 && classUser <= 16) {
      this.resClassification = {
        classificaCor: 'classiAlto',
        myClassification: 'Alto Risco',
      }
      this.saveUserClassification(this.resClassification);
      return this.resClassification;
    } else if (classUser >= 6.1 && classUser <= 12) {
      this.resClassification = {
        classificaCor: 'classiMedio',
        myClassification: 'Medio Risco',
      }
      this.saveUserClassification(this.resClassification);
      return this.resClassification;
    } else if (classUser >= 1 && classUser <= 6) {
      this.resClassification = {
        classificaCor: 'classBaixo',
        myClassification: 'Baixo Risco',
      }
      this.saveUserClassification(this.resClassification);
      return this.resClassification;
    } else {
      this.resClassification = {
        classificaCor: 'classBaixo',
        myClassification: 'Baixo Risco',
      }
      this.saveUserClassification(this.resClassification);
      return this.resClassification;
    }
  }

  saveUserClassification(resClassification){
    this.storage.set('myClassification', resClassification);
    console.log('myClassification: ', resClassification['myClassification']);
    this.firestore.collection(`Locations`)
    .doc(`${this.userUID}`).update({
      risco: resClassification['myClassification'],
      style: resClassification['classificaCor'],
      timestamp: Date.now(),
    });  
  }

  async getRiscoColor(){
    return this.resClassification;
  }
}