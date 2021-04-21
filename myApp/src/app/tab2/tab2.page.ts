import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Plugins } from '@capacitor/core';
const { CapacitorGoogleMaps } = Plugins;
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {} from 'googlemaps';
import Marker = google.maps.Marker;


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder) {}

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  latitude: number;
  longitude: number;
  myMarker: Marker;
  user: any;

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    console.log('test');
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('success resp', resp);
      this.initMap(resp);
      this.user = resp;
    }, error => {
      console.log('error', error);
      this.initMap({
        coords: {
          latitude: 48.81094752613514,
          longitude: 2.3915569987902803
        }
      });
    });
  }


  displaymyMarkers(user): void {
    const vm = this;
    if (vm.myMarker) {
      vm.myMarker.setMap(null);
    }
    const image = '../../assets/deliver.png';
    const text = 'Am';
    const location =  new google.maps.LatLng(user.coords.latitude, user.coords.longitude);
    vm.myMarker = new google.maps.Marker({
      position: location,
      title: 'Home Center',
      map: this.map,
      label: {color: 'black', text, fontSize: '18px', fontWeight: 'bold'},
      icon: image
    });
  }

  initMap(resp: any) {
    this.latitude = resp.coords.latitude;
    this.longitude = resp.coords.longitude;

    const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

    const mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    setTimeout(() => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.displaymyMarkers(resp);
    });
  }
}
