import { Component }        from '@angular/core';
import { LoginService }      from './login.service';

@Component({
  selector: 'login-root',
  template: `
    <h2>LOGIN</h2>
    <p>{{message}}</p>
    <p>
      <button (click)="login()"  *ngIf="!loginService.isLoggedIn">Login</button>
      <button (click)="logout()" *ngIf="loginService.isLoggedIn">Logout</button>
    </p>`
})
export class LoginComponent {
  message: string;

  constructor(public loginService: LoginService) {
    this.setMessage();
  }

  setMessage() {
    this.message = this.loginService.getMessage();
  }

  login() {
    this.message = 'Trying to log in ...';
    this.loginService.login();
    this.setMessage();
  }

  logout() {
    this.loginService.logout();
    this.setMessage();
  }
}
