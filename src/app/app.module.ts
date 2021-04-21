import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { OrderListComponent } from './order-list/order-list.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule } from '@angular/common';
import {OrdersDeliverComponent} from './orders-deliver/orders-deliver.component';
import { NgMaterialIconModule } from 'ng-material-icon';
import {NgPipesModule} from 'ngx-pipes';
import { FormsModule } from '@angular/forms';
import {OrderKitchenComponent} from './order-kitchen/order-kitchen.component';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderKitchenComponent,
    OrdersDeliverComponent,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgMaterialIconModule,
    NgPipesModule,
    CommonModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    SweetAlert2Module.forRoot(),
    FormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
