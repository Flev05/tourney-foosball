import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {LeaseComponent} from './lease.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path:'',component: LeaseComponent}
        ])
    ], 
    exports: [
        RouterModule
    ]
})
export class LeaseRoutingModule {}