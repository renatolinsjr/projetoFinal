import { CovidService } from './../services/apicorona/covid.service';
import { Component, OnInit } from '@angular/core';
import { DataCovid } from '../models/datacovid';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers:[CovidService]
})
export class Tab2Page implements OnInit {

  public lista_corona:any = [];

  constructor(
    public CovidService: CovidService
  ){    
  }

  ngOnInit(){
    this.listaCorona();
  }

  ionViewDidEnter(){   
  }

  listaCorona(){
    this.CovidService.getCorona()
    .subscribe((dataCovid)=>{
      this.lista_corona = dataCovid['data'];
      console.log(this.lista_corona);
      },
      error=>{  
    });
  }

}
