import { Component, OnInit } from '@angular/core';

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
export class UmComponent   {
}
