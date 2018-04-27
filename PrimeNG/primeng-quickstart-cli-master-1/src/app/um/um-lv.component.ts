import { Component, OnInit }    from '@angular/core';

import { AuthService }        from '../login/auth.service';
import { User }               from '../login/user';

import 'rxjs/add/operator/map';

@Component({
  template:  `
    <h1>User list view</h1>
    <ul>
      <li *ngFor="let u of users">{{ u.id }} {{ u.username }} {{ u.firstname }} {{ u.lastname }}</li>
    </ul>
  `
})
export class UserListViewComponent implements OnInit {
  
  users: User[];
  
  constructor(public authService: AuthService ) { 
  }

  ngOnInit() {
      this.authService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
