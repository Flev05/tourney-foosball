import { Component, OnInit } from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import { Router } from '@angular/router';
import { LoginService } from './service/login-service';
import { RoleService } from './service/role-service';
import { ClientService } from './service/client-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
      trigger('overlayState', [
          state('hidden', style({
              opacity: 0
          })),
          state('visible', style({
              opacity: 1
          })),
          transition('visible => hidden', animate('400ms ease-in')),
          transition('hidden => visible', animate('400ms ease-out'))
      ]),
  
      trigger('notificationTopbar', [
        state('hidden', style({
          height: '0',
          opacity: 0
        })),
        state('visible', style({
          height: '*',
          opacity: 1
        })),
        transition('visible => hidden', animate('400ms ease-in')),
        transition('hidden => visible', animate('400ms ease-out'))
      ])
  ],
})
export class AppComponent implements OnInit{
    
    menuActive: boolean;
    
    activeMenuId: string;
    
    notification: boolean = false;
    
    constructor(protected loginService: LoginService
          , protected roleService: RoleService
          , protected clientService: ClientService
          , private router: Router
    ) {}

    ngOnInit() {
        setTimeout(()=>this.notification = true , 1000);
    }
    
    changeTheme(event: Event, theme: string) {
        let themeLink: HTMLLinkElement = <HTMLLinkElement> document.getElementById('theme-css');
        themeLink.href = 'assets/components/themes/' + theme + '/theme.css';
        event.preventDefault();
    }
    
    onMenuButtonClick(event: Event) {
        this.menuActive = !this.menuActive;
        event.preventDefault();
    }
    
    closeNotification(event) {
        this.notification = false;
        event.preventDefault();
    }

    logout(event) {
        this.menuActive = false;
        this.loginService.sendLogout().subscribe(() => this.goHome());  
    }

    goHome(): void {
        this.loginService.isUserLogged=false;
        let redirect = '/login';
        this.router.navigate([redirect]);
    }
  }
