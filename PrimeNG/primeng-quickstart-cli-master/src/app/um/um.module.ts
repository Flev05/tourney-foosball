import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { UmComponent }            from './um.component';
import { UserListViewComponent }   from './um-lv.component';
import { UserDetailViewComponent }  from './um-dv.component';

import { UmRoutingModule }        from './um-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UmRoutingModule
  ],
  declarations: [
    UmComponent,
    UserListViewComponent,
    UserDetailViewComponent
  ]
})
export class UmModule {}
