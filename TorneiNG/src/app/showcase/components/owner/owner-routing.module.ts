import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {OwnerComponent} from './owner.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {path:'',component: OwnerComponent}
        ])
    ], 
    exports: [
        RouterModule
    ]
})
export class OwnerRoutingModule {}