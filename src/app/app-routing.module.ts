import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { OrderListComponent } from './order-list/order-list.component';
import {OrdersDeliverComponent} from './orders-deliver/orders-deliver.component';
import {OrderKitchenComponent} from './order-kitchen/order-kitchen.component';

const routes: Routes = [
  { path: 'orders', component: OrderListComponent },
  { path: 'deliver', component: OrdersDeliverComponent },
  { path: 'kitchen', component: OrderListComponent },
  { path: '', component: OrderKitchenComponent },
  { path: '**', component: OrderKitchenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
