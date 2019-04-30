import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';



@Injectable()
export class CarrinhoProvider {
  private PATH: string = 'carrinho/';


  constructor(private db:AngularFireDatabase,
              private fa: AngularFireAuth) {
        if(!this.fa.auth.currentUser) return;


      this.PATH += this.fa.auth.currentUser.uid + '/';
  }
   getCarrinhoTotalItens(){
    return this.db.list(this.PATH)
    .snapshotChanges().pipe(
      map(changes =>{
        return changes.length;
      })
    )




   }

  public adicionaProduto(item: any){
    return this.db.list(this.PATH).push(item);


  }
  getCarrinhoTotal(){
    return this.db.list(this.PATH)
      .snapshotChanges().pipe(
        map(changes => {
          return changes
            .map((m:any ) => (m.payload.val().total))
            .reduce( (prev:number, current:number) => {
              return prev + current;
            })
        })
      )
}

public getCarrinhoItems() {
  return this.db.list(this.PATH)
    .snapshotChanges().pipe(
      map(changes => {
        return changes.map(m => ({ key: m.key, ...m.payload.val() }));
      })
    )
}


public alterarProdutos(item: any) {
  return this.db.object(this.PATH + item.key).update({ qtd: item.qtd, total: item.total });
}

public removeProdutos(item: any) {
  return this.db.object(this.PATH + item.key).remove();
}


}
