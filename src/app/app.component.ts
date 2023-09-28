import { Component, ViewChild, ElementRef } from '@angular/core';
import { MapComponent } from './map/map.component';
import { Filter } from './filter/model';
import { FILTERS } from 'src/constant';
import { sdk } from 'src/services/sdk';
import { Hospital } from './filter/model';
import { FilterComponent } from './filter/filter.component';
import { Position } from './map/model';
// import MarkerClusterer from '@googlemaps/markerclustererplus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'map-mobile-app';
  @ViewChild(MapComponent)
  mapComponent: MapComponent;
  @ViewChild(FilterComponent)
  filterComponent: FilterComponent;
  @ViewChild('filterComponent', { read: ElementRef })
  private filterRef: ElementRef<HTMLElement>;
  mapLoading: boolean = false;
  isInitCurrentPosition: boolean;
  filters = FILTERS;
  public tab: string;

  constructor() {
    this.tab = 'maps';
  }

  public onChangeTab(event: Event, tab: string) {
    const bottomNav = document.getElementById('bottom_nav') as HTMLElement;
    const clickedButton = (event.target as HTMLElement).closest(
      '.bottom_nav-item'
    );

    if (clickedButton) {
      const buttons = bottomNav.querySelectorAll('.bottom_nav-item');
      buttons.forEach((button: any) => {
        button.classList.remove('active');
      });
      clickedButton.classList.add('active');
    }
    this.tab = tab;
  }

  onChangeToMapTab() {
    this.tab = 'maps';
    const bottomNav = document.getElementById('bottom_nav') as HTMLElement;
    const buttons = bottomNav.querySelectorAll('.bottom_nav-item') as any;
    buttons.forEach((button: HTMLElement) => {
      button.classList.remove('active');
    });
    $('#map_select').addClass('active');
  }

  async fetchData(filter: Filter) {
    if (!filter.value) return;
    const filterEl = this.filterRef.nativeElement;
    const filterContentEl = filterEl.getElementsByClassName('filter')[0];
    this.mapLoading = true;
    this.mapComponent.setOptionsMapLoading(true);
    this.filterComponent.loading = true;
    $(filterContentEl).addClass('blur');
    this.onChangeToMapTab();
    if (filter.type == this.filters.hospital) {
      try {
        const res = await sdk.get('hospitals.php', {
          params: filter,
        });
        this.mapComponent.hospitals = res.data as Hospital[];
        this.filterComponent.hospitals = res.data as Hospital[];
      } finally {
        this.mapLoading = false;
        this.mapComponent.setOptionsMapLoading(false);
        this.filterComponent.loading = false;
        $(filterContentEl).removeClass('blur');
      }
    } else {
      try {
        let lat;
        let lng;
        if (filter.type == this.filters.current) {
          lat = (this.mapComponent.currentPosition as google.maps.LatLng).lat();
          lng = (this.mapComponent.currentPosition as google.maps.LatLng).lng();
        } else {
          lat = (filter.value as Position).lat;
          lng = (filter.value as Position).lng;
        }
        const res = await sdk.get('hospitals.php', {
          params: {
            type: filter.type,
            lat: lat,
            lng: lng,
            radius: filter.radius,
          },
        });
        this.mapComponent.hospitals = res.data as Hospital[];
        this.filterComponent.hospitals = res.data as Hospital[];
      } finally {
        this.mapLoading = false;
        this.mapComponent.setOptionsMapLoading(false);
        this.filterComponent.loading = false;
        $(filterContentEl).removeClass('blur');
      }
    }
  }

  async setMarkers(filter: Filter) {
    this.resetData();
    await this.fetchData(filter);
    const hospitals = this.mapComponent.hospitals.filter(
      (item) => item.lat && item.lng
    );
    for (const key in hospitals) {
      const latLng = new google.maps.LatLng(
        hospitals[key].lat as number,
        hospitals[key].lng as number
      );
      this.mapComponent.markers[key] = new google.maps.Marker({
        position: latLng,
        map: this.mapComponent.map,
        clickable: true,
      });
      this.mapComponent.bounds.extend(latLng);
      this.mapComponent.markers[key].addListener('click', () => {
        this.setInfoMarker(hospitals[key]);
      });
    }
    // this.mapComponent.markerCluster = new MarkerClusterer(
    //   this.mapComponent.map,
    //   this.mapComponent.markers,
    //   {
    //     styles: [
    //       {
    //         url: '/assets/images/m3.png',
    //         height: 53,
    //         width: 53,
    //         textSize: 15,
    //         fontWeight: 'bold',
    //       },
    //     ],
    //   }
    // );
    if (filter.type == this.filters.current) {
      this.mapComponent.bounds.extend(this.mapComponent.currentPosition);
    }
    this.mapComponent.map.fitBounds(this.mapComponent.bounds);
  }
  resetData() {
    // if (
    //   // this.mapComponent.markerCluster ||
    //   this.mapComponent.markers.length > 0
    // ) {
    //   // this.mapComponent.markerCluster.removeMarkers(this.mapComponent.markers);
    // }
    this.mapComponent.markers.forEach((marker) => marker.setMap(null));
    this.mapComponent.markers = [];
    this.mapComponent.bounds = new google.maps.LatLngBounds();
    this.mapComponent.hospitals = [];
    this.filterComponent.hospitals = [];
  }
  setIsInitCurrentPosition(loading: boolean) {
    this.isInitCurrentPosition =
      !loading && !!this.mapComponent.currentPosition;
  }
  onFlyToMarker(position: google.maps.LatLng) {
    this.onChangeToMapTab();
    this.mapComponent.bounds = new google.maps.LatLngBounds();
    this.mapComponent.bounds.extend(position);
    this.mapComponent.map.fitBounds(this.mapComponent.bounds);
  }
  setInfoMarker(item: Hospital) {
    if ($('#info_marker').css('display') != 'none') {
      if (
        $('#info_marker').children(':first').attr('id') !=
        `hospital_${item.hosidno1}`
      ) {
        $('#info_marker').slideUp('fast', () => {
          $('#info_marker').empty();
          this.onShowInfo(item);
        });
      }
    } else this.onShowInfo(item);
  }
  onShowInfo(item: Hospital) {
    let content = `<div id="hospital_${item.hosidno1}" class="px-4 pt-2 pb-2 font-semibold text-xl">
                          <span>${item.hospital_name}</span>
                        </div>`;
    content += `<div class="px-4 text-sm text-gray-500">Address 1: ${item.address1}, ${item.city_name}, ${item.state_name}, India</div>`;
    if (item.address2) {
      content += `<div class="px-4 pb-5 text-sm text-gray-500">Address 2: ${item.address2}, ${item.city_name}, ${item.state_name}, India</div>`;
    }
    $('#info_marker').append(content);
    $('#info_marker').slideDown('fast');
  }
  onReset() {
    this.resetData();
    if (this.mapComponent.currentPosition) {
      this.mapComponent.map.setCenter(this.mapComponent.currentPosition);
    }
    this.mapComponent.map.setZoom(10);
  }
}
