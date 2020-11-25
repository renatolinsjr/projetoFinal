import { AutenticacaoService } from '../services/autenticacao/autenticacao.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private authService: AutenticacaoService,
    private route: Router
  ){    
  }

  logout(){
    this.authService.logout().then((res) => {
      this.route.navigate(['/login']);
    });
  }
}

