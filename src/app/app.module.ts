import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './map/map.component';
import { FilterComponent } from './filter/filter.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, MapComponent, FilterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzSelectModule,
    NzGridModule,
    NzPageHeaderModule,
    NzSpinModule,
    NzIconModule,
    NzCardModule,
    NzButtonModule,
    NzInputNumberModule,
    NzSpaceModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
