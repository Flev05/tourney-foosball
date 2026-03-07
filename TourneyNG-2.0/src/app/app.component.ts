import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import { Router } from '@angular/router';
import { LoginService } from './tourneyonline/service/login-service';
import { RoleService } from './tourneyonline/service/role-service';
import { ClientService } from './tourneyonline/service/client-service';
import { Combobox } from './tourneyonline/domain/tourney-combobox';
import { SelectItem } from 'primeng/api';

const redirectTourneyListView = "/login/tourneyLv";

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
    title = 'TourneyNG-2.0';
    menuActive: boolean = false;
    activeMenuId: string | null = null;
    notification: boolean = false
    clientOptions: SelectItem[] = [];
    selectedClientOption : Combobox = new Combobox();
    visibleSidebar1: boolean = true;

    constructor( public loginService: LoginService
          , protected roleService: RoleService
          , protected clientService: ClientService
          , private router: Router
          , private el: ElementRef
    ) {}

    @HostListener('document:click', ['$event'])
        onDocumentClick(event: MouseEvent) {
        // 1. If the menu is already closed, do nothing
        if (!this.menuActive) return;
        // 2. Check if the click was inside the sidebar or on the menu button
        // We look for the sidebar and the bars icon specifically
        const clickedInsideSidebar = this.el.nativeElement.querySelector('#layout-sidebar').contains(event.target);
        const clickedMenuButton = this.el.nativeElement.querySelector('.menu-button').contains(event.target);
        // 3. If the click was outside both, close the menu
        if (!clickedInsideSidebar && !clickedMenuButton) {
            this.menuActive = false;
        }
    }

    ngOnInit() {
        setTimeout(()=>this.notification = true , 1000);
        this.clientsCBEnabled();
    }

    clientsCBEnabled(): boolean {
        if(!this.loginService.isUserLogged || this.clientService.clientOptions == undefined) {
            return false;
        }
        this.clientOptions = this.clientService.clientOptions;
        let en = this.loginService.isUserLogged && this.clientOptions.length > 1 ? true : false;
        this.selectedClientOption = this.clientService.selectedClientOption;
        en = en && this.loginService.isUserLogged;
        return en;
    }
        
    onClientChange(cb: Combobox) {
        console.log(cb);
        const sc = this.clientService.selectedClients.find(c => c.id == cb.value);
        if( sc )
            this.clientService.setSelectedClient(sc);
        this.router.navigate([redirectTourneyListView]);
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
    
    closeNotification(event : any) {
        this.notification = false;
        event.preventDefault();
    }

    logout(event : any) {
        this.menuActive = false;
        // this.clientService.selectedClient = null;
        this.loginService.sendLogout().subscribe(() => this.goHome());  
    }

    goHome(): void {
        this.loginService.isUserLogged=false;
        let redirect = '/login';
        this.router.navigate([redirect]);
    }

    toggleMenu(id: string) {
        this.activeMenuId = this.activeMenuId === id ? null : id;
    }
}

