import { Component }    from '@angular/core';
import { Router }       from '@angular/router';
import { AuthService }  from './login/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <h1 class="title">Utenti</h1>
    <nav *ngIf="authService.isLoggedIn">
      <a routerLink="/um"  routerLinkActive="active">Utenti e Ruoli</a>
      <a routerLink="/session" routerLinkActive="active">Sessione</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {
  }
}
