import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarrinhoListaPage } from './carrinho-lista';

@NgModule({
  declarations: [
    CarrinhoListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CarrinhoListaPage),
  ],
})
export class CarrinhoListaPageModule {}
