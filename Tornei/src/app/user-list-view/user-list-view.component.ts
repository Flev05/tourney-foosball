import { Component, OnInit } from '@angular/core';
import { AuthService }       from '../login/auth.service';
import { User }              from '../login/user';

@Component({
  selector: 'app-user-list-view',
  templateUrl: './user-list-view.component.html',
  styleUrls: ['./user-list-view.component.css']
})
export class UserListViewComponent implements OnInit {

  users: User[];

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  getUsers() {

    this.authService.getUsers().subscribe((users) => {

      this.users = users;
      
      const found =  users.length!==0;

      if (found) {
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
}
