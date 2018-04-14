import { Component }    from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { LoginService }      from './login.service';

@Component({
  selector: 'app-root',
  template: `
    <h1 class="title">Angular Router</h1>

    <div *ngIf="loginService.isLoggedIn">
      <nav>
        <a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>        
        <a routerLink="/superheroes" routerLinkActive="active">Heroes</a>
        <a routerLink="/admin" routerLinkActive="active">Admin</a>
        <a routerLink="/login" routerLinkActive="active">Login</a>
        <a [routerLink]="[{ outlets: { popup: ['compose'] } }]">Contact</a>
      </nav>
      <router-outlet></router-outletrouter-outlet></router-outlet>
      <router-outlet name="popup"></router-outlet>
    </div>

    <div *ngIf="!loginService.isLoggedIn">
      <login-root></login-root>
    </div>
  `
})
export class AppComponent {
  message: string;

  constructor(public loginService: LoginService) {

  }
}
