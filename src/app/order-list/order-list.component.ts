import {Component, OnInit, ViewChild, ɵSafeScript} from '@angular/core';
import { OrderService } from 'src/app/order.service';
import { Order } from 'src/app/order.model';
import {} from 'googlemaps';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';


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

  selectedOrder = {
    deliver: '',
    displayId: ''
  };

  colorMarker = {
    J: '#E48952',
    U: '#3FC060',
    D: '#00CDBC'
  };

  geocoder = new google.maps.Geocoder();
  //
  constructor(private orderService: OrderService, public readonly swalTargets: SwalPortalTargets) { }

  confirm(): void {
    console.log('confirm');
  }

  deketeOrder(): void {
    console.log('confirm');
  }

  choose(name): void {
    this.selectedOrder.deliver = name;
    this.orderService.setData('currentOrders/' + this.selectedOrder.displayId + '/deliver', name).then(() => {
      this.chooseDeliver.close();
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

    const text = order.deliver ? order.deliver.charAt(0).toUpperCase() : order.index + '';
    console.log('this.selectedOrder', order);
    console.log('text', text);
    const marker = new google.maps.Marker({
      position: order.location,
      title: 'Home Center',
      map: this.map,
      label: {color: 'white', text, fontWeight: "bold"},
      icon: markerIcon
    });


    google.maps.event.addListener(marker, 'click', function() {
      console.log('click order', order);
      vm.selectedOrder = order;
      vm.chooseDeliver.fire();
    });
  }


  ngOnInit(): void {
    this.orderService.getData('users').subscribe(data => {
      this.coursiers = data.filter((item: any) => item.role === 'delivery');
    });

    const mapProperties = {
      center: new google.maps.LatLng(48.81094752613514, 2.3915569987902803),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    setTimeout(() => {
      this.map = new google.maps.Map(this.element.nativeElement, mapProperties);
    });

    this.orderService.getData('currentOrders').subscribe(data => {
      const vm = this;
      console.log('data', data);
      this.orders = data.sort((item1: Order, item2: Order) => { return new Date(item1.orderedAt).getTime() - new Date(item2.orderedAt).getTime() });
      data.forEach((order: Order, index) => {
          order.index = index + 1;
          this.geocoder.geocode({'address': order.address.address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              const latitude = results[0].geometry.location.lat();
              const longitude = results[0].geometry.location.lng();
              order.location = new google.maps.LatLng(latitude, longitude);
              vm.addMarker(order);
            }
          });
      });
    });
  }
}
