import { Component }          from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpErrorResponse }  from '@angular/common/http';
import { ErrorObservable }    from 'rxjs/observable/ErrorObservable';
import { AuthService }        from './auth.service';
import { User }               from './user';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

  // template: `
  //   <h2>Login State: {{message}}</h2>

  //   <p *ngIf="authService.isLoggedIn">
  //     <button (click)="logout()" >Logout</button>
  //     <button (click)="logout()" >Change Password</button>
  //   </p>
    
  //   <form *ngIf="!authService.isLoggedIn" #userlogin = "ngForm" (ngSubmit) = "login(userlogin.value)" >
  //     <input type = "text" name = "username" placeholder = "username" ngModel>
  //     <br/>
  //     <input type = "password" name = "password" placeholder = "password" ngModel>
  //     <br/>
  //     <input type = "submit" value = "Login">
  //   </form>
  //   `
})
export class LoginComponent {
  message: string;
  loginData = new User( 5,  "smartino",   'Stella', "Martino" );
 
  constructor(public authService: AuthService, public router: Router) {
    this.setMessage();
  }

  setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  login() {
    this.message = 'Trying to log in ... ';

    this.authService.login(this.loginData.username).subscribe((users) => {

      const found =  users.length!==0;

      if (found) {
        this.setMessage();
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/um';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirect], navigationExtras);
      } else {
        this.message = 'Login failed!';
      }
    });
  }

  logout() {
    this.message = 'Trying to log out ... ';
    this.authService.logout();
    this.setMessage();
    let redirect = '/login';
    this.router.navigate([redirect]);
  }
}
