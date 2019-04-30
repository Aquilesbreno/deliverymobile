import { CarrinhoProvider } from './../../providers/carrinho/carrinho';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { PedidosProvider } from '../../providers/pedidos/pedidos';



@IonicPage()
@Component({
  selector: 'page-pagamento',
  templateUrl: 'pagamento.html',


})
export class PagamentoPage {items: Observable<any[]>;
  total: number;
  paymentTypes: any[];
  form: FormGroup;
  seletedAddress = 'Por favor escolha um endreço de entrega';

  constructor(
    public navCtrl: NavController, private formBuilder: FormBuilder,
    private carrinhoProvider: CarrinhoProvider,
    private pedidosProvider: PedidosProvider,
    private toast: ToastController,
    public modalCtrl: ModalController) {

    this.items = this.carrinhoProvider.getCarrinhoItems();
    const subscribe = this.carrinhoProvider.getCarrinhoTotal().subscribe((totalValue: number) => {
      this.total = totalValue;
      subscribe.unsubscribe();
    });

    this.carregarFormaPagamento();
    this.createForm();
  }

  private carregarFormaPagamento() {
    // duas formas de popular um array
    // Forma 1
    this.paymentTypes = [];
    this.paymentTypes.push({ value: PedidosProvider.PAYMENT_TYPE.MONEY, description: 'Dinheiro' });
    this.paymentTypes.push({ value: PedidosProvider.PAYMENT_TYPE.CARD, description: 'Cartão de crédito/débito' });
    // Forma 2
    // this.paymentTypes = [
    //   { value: OrderProvider.PAYMENT_TYPE.MONEY, description: 'Dinheiro' },
    //   { value: OrderProvider.PAYMENT_TYPE.CARD, description: 'Cartão de crédito/débito' }];
  }

  private createForm() {
    this.form = this.formBuilder.group({
      paymentType: [0, Validators.required],
      changeTo: [''],
      cardType: [''],
      address: ['', Validators.required]
    });
  }

  criarPedidos() {
    if (this.form.valid) {
      this.pedidosProvider.criarPedidos(this.form.value)
        .then(() => {
          this.toast.create({ message: 'Pedido enviado com sucesso. Veja o status na aba "Pedidos".', duration: 3000 }).present();
          this.navCtrl.popToRoot();
        });
    }
  }

  camposRequeridos() {
    if (this.form.value.paymentType == 2) { // se cartão de crédito
      this.form.controls['cardType'].setValidators(Validators.required);
      this.form.controls['cardType'].updateValueAndValidity();
    } else {
      this.form.controls['cardType'].clearValidators();
      this.form.controls['cardType'].updateValueAndValidity();
    }
  }

  selecioneEndereco() {
    let modal = this.modalCtrl.create('EnderecoListaPage', { selectAddressMode: true });
    modal.onDidDismiss(data => {
      this.seletedAddress = data.address;
      this.form.controls['address'].setValue(data.address);
    });
    modal.present();
  }

}
