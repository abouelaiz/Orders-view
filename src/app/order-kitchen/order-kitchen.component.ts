import {Component, OnInit, ViewChild, ɵSafeScript} from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { Order } from 'src/app/order.model';
import {} from 'googlemaps';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Marker = google.maps.Marker;
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-order-kitchen',
  templateUrl: './order-kitchen.component.html',
  styleUrls: ['./order-kitchen.component.scss']
})
export class OrderKitchenComponent implements OnInit {
  orders = [];

  coursiers = [];


  @ViewChild('chooseDeliver')
  public readonly chooseDeliver!: SwalComponent;

  selectedOrder = {
    index: 0,
    deliver: '',
    displayId: '',
    status: '',
    address: {
      address: ''
    }
  };

  displayD: boolean;

  colorMarker = {
    J: '#E48952',
    U: '#3FC060',
    D: '#00CDBC'
  };

  status = {
    P: 'Appeller client !!',
    U: 'Client injoignable',
    R: 'Confirmé',
    I: 'en cours de livraison',
  };

  editOrder = false;


  filter = 'currents';

  deliveryMarkers = [];

  historyOrder = [];

  search: string = '';
  //
  constructor(private orderService: OrderService, public readonly swalTargets: SwalPortalTargets) { }

  select(order): void {
    this.selectedOrder = order;
  }

  updateStatus(status): void {
    console.log('status', status);
  }

  updateOrder(f: NgForm) {
    const {phone, total, address} = f.value;
    if (phone) {
      this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/phone', phone);
    }
    if (total) {
      this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/total',  total * 100);
      this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/discount',  0);
    }
    if (address) {
      this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/address', {address});
    }
    this.editOrder = false;
  }


  getOrders(search): Order[] {
    const ordersFilter = [];
    const vm = this;
    if (this.filter === 'currents') {
      this.orders.forEach((order: Order, index: number) => {
        if (order.name.toLowerCase().includes(search) || order.address.address.toLowerCase().includes(search)) {
          ordersFilter.push(order);
        }
      });
      return ordersFilter;
    }
    return this.historyOrder;
  }

  ngOnInit(): void {
    this.orderService.getData('users').subscribe(data => {
      this.coursiers = data.filter((item: any) => item.role === 'delivery');
    });
    this.orderService.getData('currentOrders').subscribe(data => {
      const vm = this;
      console.log('data', data);
      data.forEach((order: any) => {
        order.menus = [{label: 'Classic + frite X 2', quantity: 2}, {label: 'Frite', quantity: 1}];
      });
      this.orders = data.sort((item1: Order, item2: Order) =>
            {
              return new Date(item1.orderedAt).getTime() - new Date(item2.orderedAt).getTime();
            });
    });
  }
}
