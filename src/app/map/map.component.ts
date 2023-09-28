import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Marker } from './model';
import { environment } from 'src/environments/environment';
import { Loader } from '@googlemaps/js-api-loader';
import { Hospital } from '../filter/model';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mapLoading: boolean;
  @Output() initCurrentPositionEvent = new EventEmitter<any>();
  public loader: Loader;
  public mapOptions: google.maps.MapOptions;
  public map: google.maps.Map;
  public bounds: any;
  public _cpMarker: Marker | google.maps.Marker;
  public _cpScale: number = 6;
  public _cpConst: number = 2;
  public _cpElement: any;
  public currentPosition: google.maps.LatLng | google.maps.LatLngLiteral;
  public markerPath: string;
  public loading: boolean = false;
  markers: any[] = [];
  hospitals: Hospital[] = [];
  timer: any;
  // markerCluster: any;

  constructor() {
    this.loader = new Loader({
      apiKey: environment.apiKey,
    });
    this.mapOptions = {
      center: { lat: 21.01129586740017, lng: 78.7352036373483 },
      zoom: 10,
      maxZoom: 22,
      minZoom: 3,
      zoomControl: false,
      mapTypeControl: false,
      disableDefaultUI: true,
      restriction: {
        latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
      },
      clickableIcons: false,
    };
    this.markerPath = environment.markerPath;
    const isNative = Capacitor.isNativePlatform();
    if (isNative) {
      this._cpScale = -2;
      this._cpConst = 18;
    }
  }

  async ngOnInit() {
    this.loading = true;
    $('#map').addClass('blur');
    try {
      await this.initMap();
      this.setOptionsMapLoading(true);
      this.bounds = new google.maps.LatLngBounds();
      await this.setCenterCurrentPosition();
    } finally {
      $('#map').removeClass('blur');
      this.loading = false;
      this.onInitCurrentPosition(false);
      this.setOptionsMapLoading(false);
      const timer = setInterval(() => {
        this._cpElement = $(
          $(
            `img[src="${this.markerPath}"][style*="width: ${
              this._cpScale * 2 + this._cpConst
            }px; height: ${this._cpScale * 2 + this._cpConst}px"]`
          )[0]
        ).parent();
        if (this._cpElement[0]) {
          this.setMarkerAnimationLoop(this._cpElement);
          clearInterval(timer);
        }
      }, 200);
    }
    this.map.addListener('click', () => {
      if ($('#info_marker').css('display') != 'none') {
        $('#info_marker').slideUp('fast', () => {
          $('#info_marker').empty();
        });
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapLoading']) {
      this.loading = this.mapLoading;
      if (this.loading) $('#map').addClass('blur');
      else $('#map').removeClass('blur');
    }
  }

  async initMap() {
    await this.loader.load().then(async () => {
      const library = (await google.maps.importLibrary('maps')) as any;
      const { Map } = library;
      this.map = new Map(document.getElementById('map'), this.mapOptions);
    });
  }
  async setCenterCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const coordinate = position.coords;
      this.currentPosition = new google.maps.LatLng(
        coordinate.latitude,
        coordinate.longitude
      );
      this._cpMarker = new google.maps.Marker({
        position: this.currentPosition,
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: this._cpScale,
          fillOpacity: 1,
          strokeWeight: 2,
          fillColor: '#5384ED',
          strokeColor: '#ffffff',
        },
      });
      this.map.setCenter(this.currentPosition);
    } catch (error) {
      console.error(error);
    }
  }

  onInitCurrentPosition(loading: boolean) {
    this.initCurrentPositionEvent.emit(loading);
  }

  setOptionsMapLoading(loading: boolean) {
    if (loading) {
      this.map.setOptions({
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
      });
    } else {
      this.map.setOptions({
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
      });
    }
  }
  async setMarkerAnimationLoop(el: any) {
    this.timer = this.setIntervalAnimation(el);
    if (!el.hasClass('dot-marker')) el.addClass('dot-marker');
    if (!el.hasClass('is-highlighted')) el.addClass('is-highlighted');
    await new Promise((r) => setTimeout(r, 1000));
    el.removeClass('is-highlighted');
  }
  setIntervalAnimation(el: any) {
    return setInterval(async () => {
      if (!el.hasClass('is-highlighted')) el.addClass('is-highlighted');
      await new Promise((r) => setTimeout(r, 1000));
      if (el.hasClass('is-highlighted')) el.removeClass('is-highlighted');
    }, 2000);
  }
}
