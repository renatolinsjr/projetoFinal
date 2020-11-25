import { AutoavaliacaoPageRoutingModule } from './autoavaliacao-routing.module';
import { AutoavaliacaoPage } from './autoavaliacao.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutoavaliacaoPageRoutingModule
  ],
  declarations: [AutoavaliacaoPage]
})
export class AutoavaliacaoPageModule {}
