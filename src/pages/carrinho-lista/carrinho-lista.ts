import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { CarrinhoProvider } from './../../providers/carrinho/carrinho';



/**
 * Generated class for the CarrinhoListaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-carrinho-lista',
  templateUrl: 'carrinho-lista.html',
})
export class CarrinhoListaPage {
  items: Observable<any[]>;
  total: number;


  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    private carrinhoProvider: CarrinhoProvider) {
    this.items = this.carrinhoProvider.getCarrinhoItems();
    this.total = 0;
    this.carrinhoProvider.getCarrinhoTotal().subscribe((totalValue: number) => {
      this.total = totalValue;
    });
  }

  addQtd(item: any) {
    let qtd = item.qtd;
    qtd++;
    this.updateTotal(qtd, item);
  }

  removeQtd(item: any) {
    let qtd = item.qtd;
    qtd--;
    if (qtd <= 0) {
      this.confirmRemoveItem(item);
    } else {
      this.updateTotal(qtd, item);
    }
  }

  private updateTotal(qtd: number, item: any) {
    let total = 0;
    total = qtd * item.price;
    item.qtd = qtd;
    item.total = total;
    this.carrinhoProvider.alterarProdutos(item);
  }

  private confirmRemoveItem(item: any) {
    let confirm = this.alertCtrl.create({
      title: 'Remover o item?',
      message: 'Deseja remover o item ' + item.productName + '?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Remover item',
          handler: () => {
            this.carrinhoProvider.removeProdutos(item);
          }
        }
      ]
    });
    confirm.present();
  }

  public openPayment() {
    // this.navCtrl.push('PaymentPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarrinhoListaPage');
  }

}
