import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { CategoriasProvider } from './../../providers/categorias/categorias';
import { CarrinhoProvider } from './../../providers/carrinho/carrinho';
import { ProdutosProvider } from './../../providers/produtos/produtos';

@IonicPage()
@Component({
  selector: 'page-produtos-lista',
  templateUrl: 'produtos-lista.html',
})
export class ProdutosListaPage {
  produtos: Observable<any[]>;
  items: Observable<any[]>;
  categories: Observable<any[]>;
  category: string;
  mostrarCarrinho = false;
  totalItems: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private produtosProvider:ProdutosProvider,
    private categoryProvider: CategoriasProvider,
    private carrinhoProvider: CarrinhoProvider) {

      this.categories = this.categoryProvider.getAll();
      this.items = this.produtosProvider.getAll(null);
      this.carrinhoProvider.getCarrinhoTotalItens()
         .subscribe(total => {
           this.mostrarCarrinho = (total > 0);
           this.totalItems = total;
         })

      this.produtos = this.produtosProvider.getAll(null);


    }

    filtrarProdutos() {
      this.produtos = this.produtosProvider.getAll(this.category);
    }

    adicionaProduto(item: any) {
      console.log(item);
      this.navCtrl.push('CarrinhoEditaPage', { produto: item });
    }

    public abrirCarrinho() {
      this.navCtrl.push('CarrinhoListaPage');
    }




}
