import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UmComponent }           from './um.component';
import { UmDashboardComponent }  from './um-dashboard.component';
import { ManageCrisesComponent }    from './um-crises.component';
import { ManageHeroesComponent }    from './um-heroes.component';

import { AuthGuard }                from '../login/auth-guard.service';

const umRoutes: Routes = [
  {
    path: '',
    component: UmComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'crises', component: ManageCrisesComponent },
          { path: 'heroes', component: ManageHeroesComponent },
          { path: '', component: UmDashboardComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(umRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UmRoutingModule {}
