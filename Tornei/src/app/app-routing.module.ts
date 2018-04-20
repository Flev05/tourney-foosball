import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComposeMessageComponent }  from './compose-message.component';
import { PageNotFoundComponent }    from './not-found.component';

import { CanDeactivateGuard }       from './can-deactivate-guard.service';
import { AuthGuard }                from './login/auth-guard.service';

import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import { LoginComponent }       from './login/login.component';
import { UmModule }             from './um/um.module';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'session', component: LoginComponent },
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
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard,
    SelectivePreloadingStrategy
  ]
})
export class AppRoutingModule { }
