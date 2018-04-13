import { Component, OnInit }    from '@angular/core';

import { AuthService }        from '../login/auth.service';
import { User }               from '../login/user';

import 'rxjs/add/operator/map';

@Component({
  template:  `

    <ul>
      <li *ngFor="let u of users">{{ u.id }} {{ u.username }} {{ u.firstname }} {{ u.lastname }}</li>
    </ul>
  `
})
export class UmDashboardComponent implements OnInit {
  
  users: User[];
  
  constructor(public authService: AuthService ) { 
  }

  ngOnInit() {
      this.authService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
