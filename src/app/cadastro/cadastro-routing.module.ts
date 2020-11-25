import { Routes, RouterModule } from '@angular/router';
import { CadastroPage } from './cadastro.page';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CadastroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroPageRoutingModule {}
