import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnderecoEditaPage } from './endereco-edita';

@NgModule({
  declarations: [
    EnderecoEditaPage,
  ],
  imports: [
    IonicPageModule.forChild(EnderecoEditaPage),
  ],
})
export class EnderecoEditaPageModule {}
