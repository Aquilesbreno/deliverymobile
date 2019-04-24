import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarrinhoEditaPage } from './carrinho-edita';

@NgModule({
  declarations: [
    CarrinhoEditaPage,
  ],
  imports: [
    IonicPageModule.forChild(CarrinhoEditaPage),
  ],
})
export class CarrinhoEditaPageModule {}
