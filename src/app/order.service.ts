import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';

import { Order } from 'src/app/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  deliver: '';

  constructor(private firestore: AngularFirestore, private db: AngularFireDatabase) { }

  getData(key) {
    return this.db.list(key).valueChanges();
  }


  setData(key, val) {
    return this.db.object(key).set(val);
  }
}
