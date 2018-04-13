import { Component } from '@angular/core';
import { AuthService }        from '../login/auth.service';
import { User }               from '../login/user';

@Component({
  template:  `
    <nav>
      <a routerLink="./" routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }">User List View</a>
      <a routerLink="./crises" routerLinkActive="active">New User</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class UmComponent {
  constructor(public authService: AuthService ) {
   
  }
}
