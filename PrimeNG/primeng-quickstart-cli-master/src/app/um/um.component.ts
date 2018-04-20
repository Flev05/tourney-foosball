import { Component, OnInit } from '@angular/core';

@Component({
  template:  `
    <nav>
      <a routerLink="./lv" routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: true }">User List View</a>

      <a routerLink="./new-user" routerLinkActive="active">New User</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class UmComponent   {
}
