import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard }            from './auth-guard.service';
import { AuthService }          from './auth.service';
import { LoginService }       from './login.service';

//const loginRoutes: Routes = [
//  { path: 'login', component: LoginComponent }
// ];

@NgModule({
  imports: [
   // RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    LoginService,
    AuthService
  ]
})
export class LoginRoutingModule {}
