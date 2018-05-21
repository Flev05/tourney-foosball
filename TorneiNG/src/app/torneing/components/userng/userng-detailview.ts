import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Userng } from '../../domain/userng';
import { UserngService } from '../../service/userngservice';
import { RoleService } from '../../service/roleservice';
import { Roles } from '../../domain/roles';

@Component({
    templateUrl: './userng-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class UserngDetailView implements OnInit {

    selectedUserng: Userng;
    cols: any[];

    roles : Roles[];
    
    selectedRoles: Roles[];

    constructor(
        private route: ActivatedRoute,
        private userngService: UserngService,
        private roleService: RoleService,
        private location: Location
    ) {}

    ngOnInit() {

        this.getUserng();

        this.cols = [
            { field: 'rolename',    header: 'Nome ruolo' },
            { field: 'description', header: 'Descrizione' },
        ];

        this.roleService.loadRolesSmall().subscribe(rs => this.roles = rs);
    }

    getUserng(): void {
        this.selectedUserng = this.userngService.selectedUserng;

        this.selectedRoles = this.selectedUserng.roles;
    }

    save(): void {
        if(this.userngService.newUserng) {
            this.userngService.addUserng(this.selectedUserng).subscribe(() => this.goBack());  
        } else  {
            this.userngService.updateUserng(this.selectedUserng).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.userngService.deleteUserng(this.selectedUserng)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
