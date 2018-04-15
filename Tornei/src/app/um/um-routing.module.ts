import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UmComponent }           from './um.component';
import { UserListViewComponent }  from './um-lv.component';
import { UserDetailViewComponent }    from './um-dv.component';

import { AuthGuard }                from '../login/auth-guard.service';

const umRoutes: Routes = [
  {
    path: '',
    component: UmComponent,
    children: [
      {
        path: '',
        children: [
          { path: 'lv', component: UserListViewComponent },
          { path: 'new-user', component: UserDetailViewComponent }
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
