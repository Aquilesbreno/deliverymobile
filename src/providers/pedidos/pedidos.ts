import { CarrinhoProvider } from './../carrinho/carrinho';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';


@Injectable()
export class PedidosProvider {
  private PATH: string = 'carrinho/';
  private PATHP: string = 'pedidos';

  public static STATUS = {
    SENT: 0,
    CONFIRMED: 1,
    OUT_FOR_DELIVERY: 2,
    DELIVERED: 3
  };

  public static PAYMENT_TYPE = {
    MONEY: 1,
    CARD: 2
  };


  constructor( private db: AngularFireDatabase, private fa: AngularFireAuth,
    private dateFormat: DatePipe, private carrinhoProvider:CarrinhoProvider)
    {
      if(!this.fa.auth.currentUser) return;


      this.PATH += this.fa.auth.currentUser.uid + '/';

    }





  public criarPedidos (order: any) {
    return new Promise((resolve) => {
      let number = '#' + this.dateFormat.transform(new Date(), 'ddMMyyyyHHmmss');
      let date = this.dateFormat.transform(new Date(), 'dd/MM/yyyy');

      const cart = this.carrinhoProvider.getCarrinhoItems().subscribe(cartItems => {
        cart.unsubscribe();

        let total = 0;
        let items = [];
        // Pegando os itens do pedido
        cartItems.forEach(item => {
          items.push(item);
          total += item.total;
        });

        // Criando o pedido
        let orderToSave = {
          number: number,
          status: PedidosProvider.STATUS.SENT, // pedido enviado
          date: date,
          paymentType: order.paymentType,
          changeTo: order.changeTo,
          cardType: order.cardType,
          address: order.address,
          userId: this.fa.auth.currentUser.uid,
          userName: this.fa.auth.currentUser.displayName,
          userStatus: this.fa.auth.currentUser.uid + '_' + PedidosProvider.STATUS.SENT, // Tecnica para filtro de varios campos
          total: total,
          items: items,
        };

        let orderRef = this.db.list(this.PATHP);
        orderRef.push(orderToSave)
          .then(() => {
            //nesse momento eu limpo o carrinho
            this.db.object(this.PATH).remove();
            resolve();
          });
      });
    });
  }


  getStatusName(status: number) {
    switch (status) {
      case PedidosProvider.STATUS.SENT:
        return 'Aguardando confirmação';
      case PedidosProvider.STATUS.CONFIRMED:
        return 'Em preparação';
      case PedidosProvider.STATUS.OUT_FOR_DELIVERY:
        return 'Saiu para entrega';
      case PedidosProvider.STATUS.DELIVERED:
        return 'Entregue';
    }
  }

  getPaymentType(paymentType: number) {
    switch (paymentType) {
      case PedidosProvider.PAYMENT_TYPE.MONEY:
        return 'Dinheiro';
      case PedidosProvider.PAYMENT_TYPE.CARD:
        return 'Cartão de crédito/débido';
    }
  }


  public adicionaProduto(item: any){


  }



}
