import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'demo', loadChildren: './components/demo/demo.module#DemoModule'},
            {path: 'owner', loadChildren: './components/owner/owner.module#OwnerModule'},
            {path: 'realtime', loadChildren: './components/realtime/realtime.module#RealtimeModule'},
            {path: 'company', loadChildren: './components/company/company.module#CompanyModule'},
            // {path: 'user', loadChildren: './components/user/user.module#UserModule'},
            {path: 'tornei', loadChildren: './components/tornei/tornei.module#TorneiModule'},
        ])    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
