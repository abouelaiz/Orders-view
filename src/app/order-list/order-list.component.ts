import {Component, OnInit, ViewChild, ɵSafeScript} from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { Order } from 'src/app/order.model';
import {} from 'googlemaps';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Marker = google.maps.Marker;
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @ViewChild('map')
  element: any;

  map: google.maps.Map;

  @ViewChild('chooseDeliver')
  public readonly chooseDeliver!: SwalComponent;

  orders = [];

  coursiers = [];

  markers = [];

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

  geocoder = new google.maps.Geocoder();

  search: string = '';
  //
  constructor(private orderService: OrderService, public readonly swalTargets: SwalPortalTargets) { }

  select(order): void {
    this.selectedOrder = order;
  }

  toogleDisplayD(): void {
    this.displayD = !this.displayD;
    const map = this.displayD ? null : this.map;
    for (let i = 0; i < this.deliveryMarkers.length; i++) {
      this.deliveryMarkers[i].setMap(map);
    }
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
    this.chooseDeliver.close();
  }

  updateStatus(status): void {
    this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/status', status).then(() => {
      this.chooseDeliver.close();
    });
  }

  getOrders(search): Order[] {
    const ordersFilter = [];
    const vm = this;
    if (this.filter === 'currents') {
      this.orders.forEach((order: Order, index: number) => {
        if (order.name.toLowerCase().includes(search) || order.address.address.toLowerCase().includes(search)) {
          ordersFilter.push(order);
          if (vm.markers[index]) {
            vm.markers[index].setMap(this.map);
          }
        } else {
          if (vm.markers[index]) {
            vm.markers[index].setMap(null);
          }
        }
      });
      return ordersFilter;
    }
    return this.historyOrder;
  }

  choose(name): void {
    this.selectedOrder.deliver = name;
    this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/deliver', name).then(() => {
      this.addMarker(this.selectedOrder);
    });
  }

  addMarker(order): void {
    const vm = this;
    const colorIcon = this.colorMarker[order?.restaurant?.platform] || '#000';
    const markerIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colorIcon,
      fillOpacity: .9,
      scale: 15,
      strokeColor: colorIcon,
      strokeWeight: 1
    };

    let text = order.deliver ? order.deliver.slice(0, 2) : order.index + '';
    if (order.order) {
      text = text + order.order;
    }
    const location =  new google.maps.LatLng(order.location.latitude, order.location.longitude);
    const marker = new google.maps.Marker({
      position: location,
      title: 'Home Center',
      map: this.map,
      label: {color: 'white', text, fontWeight: 'bold'},
      icon: markerIcon
    });

    vm.markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
      vm.selectedOrder = order;
      vm.chooseDeliver.fire();
    });
  }

  displayDeliveryMarkers(): void {
    const vm = this;
    const colorIcon = '#000';
    for (let i = 0; i < vm.deliveryMarkers.length; i++) {
      vm.deliveryMarkers[i].setMap(null);
    }
    this.coursiers.forEach(user => {
      if (user.coords && user.coords.date &&((new Date().getTime() - user.coords.date) <= 10 * 60 * 1000)) {
        const image = '../assets/deliver.png';
        const text = user.name.slice(0, 2);
        const location =  new google.maps.LatLng(user.coords.lat, user.coords.log);
        const marker = new google.maps.Marker({
          position: location,
          title: 'Home Center',
          map: this.map,
          label: {color: 'black', text, fontSize: '18px', fontWeight: 'bold'},
          icon: image
        });
        vm.deliveryMarkers.push(marker);
      }
    });
  }

  displayOrders(orders): void  {
    const vm = this;
    for (let i = 0; i < vm.markers.length; i++) {
      vm.markers[i].setMap(null);
    }
    vm.markers = [];
    this.orders = orders.filter((order: Order) => { return (order.status !== 'D' && order.status !== 'C'); });
    this.historyOrder = orders.filter((order: Order) => { return (order.status === 'D' || order.status === 'C'); }).reverse();
    this.orders.forEach((order: Order, index) => {
          order.index = index + 1;
          if (!order.location) {
          this.geocoder.geocode({'address': order.address.address}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            const latitude = results[0].geometry.location.lat();
            const longitude = results[0].geometry.location.lng();
            order.location = {latitude, longitude};
            vm.orderService.setData('currentOrders/' + order.displayId + '/location', order.location).then(() => {
              vm.addMarker(order);
            });
          }
        });
      } else {
        vm.addMarker(order);
      }
    });
  }

  ngOnInit(): void {
    this.orderService.getData('users').subscribe(data => {
      this.coursiers = data.filter((item: any) => item.role === 'delivery');
      this.displayDeliveryMarkers();
    });

    const mapProperties = {
      center: new google.maps.LatLng(48.81094752613514, 2.3915569987902803),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    setTimeout(() => {
      this.map = new google.maps.Map(this.element.nativeElement, mapProperties);
    });

    this.orderService.getData('currentOrders').subscribe(data => {
      const vm = this;
      this.orders = data.sort((item1: Order, item2: Order) => { return new Date(item1.orderedAt).getTime() - new Date(item2.orderedAt).getTime() });
      vm.displayOrders(this.orders);
    });
  }
}
