
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PedidosProvider } from './../../providers/pedidos/pedidos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {minValueValidator} from '../../diretives/min-value/min-value';
import { CarrinhoProvider } from './../../providers/carrinho/carrinho';



/**
 * Generated class for the CarrinhoEditaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-carrinho-edita',
  templateUrl: 'carrinho-edita.html',

})
export class CarrinhoEditaPage {
  title: string;
  description: string;
  price: number;
  total: number;
  form: FormGroup;
  private product: any;



  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private toast: ToastController, private formBuilder: FormBuilder,
    private pedidosProvider: PedidosProvider) {

    this.setupPage();
    this.createForm();
  }

  private setupPage() {
    this.product = this.navParams.data.produto;
    this.title = this.product.name;
    this.description = this.product.description;
    this.price = this.product.price;
    this.total = this.product.price;
  }

  private createForm() {
    this.form = this.formBuilder.group({
      productKey: [this.product.key],
      productName: [this.product.name],
      description: [this.product.description],
      qtd: [1, [Validators.required, minValueValidator(1)]],
      price: [this.product.price],
      obs: [''],
      total: [this.product.price]
    });
  }

  //botao (+) adicionar
  addQtd() {
    let qtd = this.form.value.qtd;
    qtd++;

    this.form.controls['qtd'].setValue(qtd);
    this.updateTotal(qtd);
  }

  //botao (-) remover
  removeQtd() {
    let qtd = this.form.value.qtd;

    qtd--;
    // forço a quantidade nunca ser menor que 0
    if (qtd < 0)
      qtd = 0;

    this.form.controls['qtd'].setValue(qtd);
    this.updateTotal(qtd);
  }

  //quando o usuário mudar o valor direto na cx ao invés do botao
  qtdChanged($event) {
    this.updateTotal($event.value);
  }

  private updateTotal(qtd: number) {
    this.total = this.getTotal(qtd, this.price);
    // atualizar o controle total no form
    this.form.controls['total'].setValue(this.total);
  }

  private getTotal(price: number, qtd: number) {
    return qtd * price;
  }


  onSubmit() {
    if (this.form.valid) {
      this.pedidosProvider.adicionaProduto(this.form.value);
      this.toast.create({ message: 'Produto adicionado com sucesso.', duration: 3000 }).present();
      this.navCtrl.pop();
    }
  }

}
