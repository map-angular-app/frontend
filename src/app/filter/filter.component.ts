import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Option, Hospital } from './model';
import { sdk } from 'src/services/sdk';
import { FILTERS } from 'src/constant';
import { Filter } from './model';
import { Position } from '../map/model';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Input() isInitCurrentPosition: boolean;
  @Output() setFilterEvent = new EventEmitter<any>();
  @Output() setFlyEvent = new EventEmitter<any>();
  @Output() resetEvent = new EventEmitter<any>();
  filterType = null;
  filterValue: string | Position | null = null;
  filters = FILTERS;
  loadingCitys: boolean = false;
  citys: Hospital[] = [];
  loadingHospitalChains: boolean = false;
  hospitalChains: Hospital[] = [];
  optionsCity: Option[] = [];
  optionsHospitalChain: Option[] = [];
  hospitals: Hospital[] = [];
  loading: boolean = false;
  radius: number | null | undefined = 20;

  ngOnInit(): void {
    this.fetchCityList();
    this.fetchHospitalList();
  }

  fetchCityList() {
    this.loadingCitys = true;
    sdk
      .get('city-list.php')
      .then((response) => {
        this.citys = response.data;
        this.optionsCity = this.citys.map((item) => {
          return {
            label: item.city_name,
            value: (item.city_name as string).toLowerCase(),
            position: {
              lat: item.lat,
              lng: item.lng,
            },
          };
        }) as Option[];
      })
      .finally(() => {
        this.loadingCitys = false;
      });
  }
  fetchHospitalList() {
    this.loadingHospitalChains = true;
    sdk
      .get('hospital-list.php')
      .then((response) => {
        this.hospitalChains = response.data;
        this.optionsHospitalChain = this.hospitalChains.map((item) => {
          return {
            label: item.hospital_name,
            value: (item.hospital_name as string).toLowerCase(),
          };
        }) as any;
      })
      .finally(() => {
        this.loadingHospitalChains = false;
      });
  }
  onChangeType(value: string) {
    this.radius = 20;
    if (value == this.filters.current) this.filterValue = value;
    else this.filterValue = null;
  }
  onFilter() {
    let filter: Filter = { type: this.filterType, value: this.filterValue };
    if (filter.type == this.filters.current || filter.type == this.filters.city)
      filter.radius = this.radius;
    this.setFilterEvent.emit(filter);
  }
  getDisabledApplyButton() {
    if (this.loading) return true;
    if (!this.filterType || !this.filterValue) return true;
    if (this.filterType == this.filters.current && !this.radius) return true;
    if (this.filterType == this.filters.city && !this.radius) return true;
    return false;
  }
  setCardItemWidth() {
    const body = document.body,
      html = document.documentElement;
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    if (height >= 652 && height <= 698) return '200px';
    else if (height >= 632 && height <= 651) return '180px';
    else if (height <= 631) return '150px';
    return '240px';
  }
  onTriggerFlyEvent(item: Hospital) {
    if (!item.lat || !item.lng) return;
    const position = new google.maps.LatLng(
      item.lat as number,
      item.lng as number
    );
    this.setFlyEvent.emit(position);
  }
  onReset() {
    this.filterValue = null;
    this.filterType = null;
    this.radius = 20;
    this.resetEvent.emit();
  }
}
