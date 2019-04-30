import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnderecoListaPage } from './endereco-lista';

@NgModule({
  declarations: [
    EnderecoListaPage,
  ],
  imports: [
    IonicPageModule.forChild(EnderecoListaPage),
  ],
})
export class EnderecoListaPageModule {}
