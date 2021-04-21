import {Component, OnInit, ViewChild, ɵSafeScript} from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { Order } from 'src/app/order.model';
import {} from 'googlemaps';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Marker = google.maps.Marker;
import {GeolocationService} from '@ng-web-apis/geolocation';


@Component({
  selector: 'app-orders-deliver',
  templateUrl: './orders-deliver.component.html',
  styleUrls: ['./orders-deliver.component.scss']
})
export class OrdersDeliverComponent implements OnInit {
  @ViewChild('map')
  element: any;

  map: google.maps.Map;

  status = {
    P: 'Appeller client !!',
    U: 'Client injoignable',
    R: 'Confirmé',
    I: 'en cours de livraison',
  };

  deliver = '';


  @ViewChild('chooseDeliver')
  public readonly chooseDeliver!: SwalComponent;

  @ViewChild('login')
  public readonly login!: SwalComponent;

  orders = [];

  mode = 'list';
  coursiers = [];

  markers = [];

  selectedOrder: Order;

  colorMarker = {
    J: '#E48952',
    U: '#3FC060',
    D: '#00CDBC'
  };

  deliverOrders = [];

  coords = {};

  geocoder = new google.maps.Geocoder();
  //
  constructor(private orderService: OrderService, public readonly swalTargets: SwalPortalTargets, private readonly geolocation$: GeolocationService) {
  }


  setUserGeolocation(position): void{
    const coords = {
      lat: position.coords.latitude,
      log: position.coords.longitude,
      date: new Date().getTime()
    };
    console.log('coords', coords);
    console.log('this.deliver', this.deliver);
    this.orderService.setData('users/' + this.deliver + '/coords', coords).then(() => {
      console.log('success coords');
    });
  }

  select(order): void {
    console.log('select order', order);
    this.selectedOrder = order;
  }

  confirmLogin(): void {
    console.log('select order');
    if (!this.deliver)
      this.login.fire();
  }


  updateStatus(status): void {
    this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/status', status).then(() => {
        this.chooseDeliver.close();
    });
  }

  setOrder(num): void {
    this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/order', num + 1).then(() => {
      this.chooseDeliver.close();
    });
  }

  choose(name): void {
    this.deliver = name;
    this.displayOrders();
    this.geolocation$.subscribe(position => this.setUserGeolocation(position), error => {
      console.log('error', error);
    });
    this.login.close();
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

    const text = order.order ? order.order + '' : '-';
    console.log('order', order);
    console.log('order', text);
    const location =  new google.maps.LatLng(order.location.latitude, order.location.longitude);
    const marker = new google.maps.Marker({
      position: location,
      title: 'Home Center',
      map: this.map,
      label: {color: 'white', text, fontWeight: "bold"},
      icon: markerIcon
    });

    vm.markers.push(marker);
    console.log('this.markers[this.selectedOrder.index]', order.index);
    google.maps.event.addListener(marker, 'click', function() {
      vm.selectedOrder = order;
      vm.chooseDeliver.fire();
    });
  }

  displayOrders(): void  {
    const vm = this;
    this.deliverOrders = this.orders.filter((order: Order) => {
      return (order.deliver === this.deliver && order.status !== 'D' && order.status !== 'C');
    });
    for (let i = 0; i < vm.markers.length; i++) {
      vm.markers[i].setMap(null);
    }
    console.log('this.deliverOrders', this.deliverOrders);
    if (this.mode === 'map') {
      this.deliverOrders.forEach((order: Order, index: number) => {
        // order.index = index;
        if (order.phone.includes('(')) {
          const phones = order.phone.replace('(', ')').split(')');
          if (phones.length > 2) {
            order.phone = phones[0];
            order.phoneCode = phones[1];
          }
        }
        vm.addMarker(order);
      });
    }
  }

  setMap(): void {

    this.mode = 'map';

    const mapProperties = {
      center: new google.maps.LatLng(48.757356, 2.387930),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    setTimeout(() => {
      this.map = new google.maps.Map(this.element.nativeElement, mapProperties);
      this.displayOrders();
    });
  }

  ngOnInit(): void {
    this.orderService.getData('users').subscribe(data => {
      this.coursiers = data.filter((item: any) => item.role === 'delivery');
      if (!this.deliver) {
        setTimeout(() => {
          this.login.fire();
        }, 1000);
      }
    });

    this.orderService.getData('currentOrders').subscribe(data => {
      this.orders = data;
      if (this.deliver) {
        this.displayOrders();
      }
    });
  }
}
