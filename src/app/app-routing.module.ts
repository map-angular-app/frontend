import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { FilterComponent } from './filter/filter.component';

const routes: Routes = [
  {
    path: 'maps',
    component: MapComponent,
  },
  {
    path: 'filters',
    component: FilterComponent,
  },
  // Always go on /tasks path
  { path: '', redirectTo: '/maps', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
