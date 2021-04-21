import {Component, OnInit, ViewChild} from '@angular/core';
import { OrderService } from '../order.service';
import {SwalComponent, SwalPortalTargets} from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{


  currentOrders = [];
  historyOrders = [];
  selectedOrder: any = {};
  status = {
    P: 'Appeller client !!',
    U: 'Client injoignable',
    R: 'Confirmé',
    I: 'En cours de livraison',
    D: 'Livré',
    C: 'Annulé'
  };

  @ViewChild('detailOrder')
  public readonly detailOrder!: SwalComponent;

  constructor(private orderService: OrderService, public readonly swalTargets: SwalPortalTargets) {}

  ngOnInit() {
    this.orderService.getMyOrder().subscribe((data: any) => {
      console.log('data', data);
      this.historyOrders = data.historyOrders;
      this.currentOrders = data.currentOrders;
    });
  }

  updateStatus(status): void {
    this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/status', status).then(() => {
      this.detailOrder.close();
    });
  }

  setOrder(num) {
    this.selectedOrder.order = num + 1;
  }

}
