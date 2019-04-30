import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pagamento',
  templateUrl: 'pagamento.html',
  items: Observable<any[]>;
  total: number;
  paymentTypes: any[];
  form: FormGroup;
  seletedAddress = 'Por favor escolha um endreço de entrega';

})
export class PagamentoPage {

  constructor(
    public navCtrl: NavController, private formBuilder: FormBuilder,
    private orderProvider: OrderProvider, private toast: ToastController,
    public modalCtrl: ModalController) {

    this.items = this.orderProvider.getCartItems();
    const subscribe = this.orderProvider.getCartTotalValue().subscribe((totalValue: number) => {
      this.total = totalValue;
      subscribe.unsubscribe();
    });

    this.loadPaymentTypes();
    this.createForm();
  }

  private loadPaymentTypes() {
    // duas formas de popular um array
    // Forma 1
    this.paymentTypes = [];
    this.paymentTypes.push({ value: OrderProvider.PAYMENT_TYPE.MONEY, description: 'Dinheiro' });
    this.paymentTypes.push({ value: OrderProvider.PAYMENT_TYPE.CARD, description: 'Cartão de crédito/débito' });
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

  createOrder() {
    if (this.form.valid) {
      this.orderProvider.createOrder(this.form.value)
        .then(() => {
          this.toast.create({ message: 'Pedido enviado com sucesso. Veja o status na aba "Pedidos".', duration: 3000 }).present();
          this.navCtrl.popToRoot();
        });
    }
  }

  setRequiredField() {
    if (this.form.value.paymentType == 2) { // se cartão de crédito
      this.form.controls['cardType'].setValidators(Validators.required);
      this.form.controls['cardType'].updateValueAndValidity();
    } else {
      this.form.controls['cardType'].clearValidators();
      this.form.controls['cardType'].updateValueAndValidity();
    }
  }

  selectAddress() {
    let modal = this.modalCtrl.create('AddressListPage', { selectAddressMode: true });
    modal.onDidDismiss(data => {
      this.seletedAddress = data.address;
      this.form.controls['address'].setValue(data.address);
    });
    modal.present();
  }

}
