import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  deliver: '';

  constructor(private firestore: AngularFirestore, private db: AngularFireDatabase) { }

  getData(key) {
    return this.db.list(key).valueChanges();
  }

  getMyOrder() {

    const currentOrders = [];
    const historyOrders = [];

    return this.db.list('/currentOrders', ref => ref.orderByChild('deliver').equalTo('Amine'))
      .valueChanges().subscribe((data => {
        console.log('data', data);
        data.forEach((order: any) => {
          if (order.status === 'D' || order.status === 'C') {
            historyOrders.push(order);
          } else {
            currentOrders.push(order);
          }
        });
        return {currentOrders, historyOrders};
      }));
  }

  setData(key, val) {
    return this.db.object(key).set(val);
  }
}
