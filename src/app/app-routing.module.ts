import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  { path: 'orders', component: OrderListComponent },
  { path: '', component: OrderListComponent },
  { path: '**', component: OrderListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
