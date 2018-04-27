import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import { LoginComponent }       from './login/login.component';
import { UmModule }             from './um/um.module';
import { PageNotFoundComponent }    from './not-found.component';
import { AuthGuard }                from './login/auth-guard.service';

const appRoutes: Routes = [
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'session', component: LoginComponent },
    {
        path: 'menubar', 
        loadChildren: 'app/menubar/menubardemo.module#MenubarDemoModule'
    },
    {
      path: 'um',
      loadChildren: 'app/um/um.module#UmModule',
      canLoad: [AuthGuard]
    },
    { path: '**', component: PageNotFoundComponent }
 ];
  
@NgModule({
    imports: [
        UmModule,
        RouterModule.forRoot(
            appRoutes,
            {
              enableTracing: true, // <-- debugging purposes only
              preloadingStrategy: SelectivePreloadingStrategy,
            }
          )   
    ],
    exports: [RouterModule],
    providers: [
        SelectivePreloadingStrategy
      ]
})
export class AppRoutingModule {}
