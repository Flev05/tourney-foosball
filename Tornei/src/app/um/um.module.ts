import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { UmComponent }            from './um.component';
import { UmDashboardComponent }   from './um-dashboard.component';
import { ManageCrisesComponent }  from './um-crises.component';
import { ManageHeroesComponent }  from './um-heroes.component';

import { UmRoutingModule }        from './um-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UmRoutingModule
  ],
  declarations: [
    UmComponent,
    UmDashboardComponent,
    ManageCrisesComponent,
    ManageHeroesComponent
  ]
})
export class UmModule {}
