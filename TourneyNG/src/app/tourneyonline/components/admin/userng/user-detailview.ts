import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Userng } from '../../../domain/userng';
import { UserngService } from '../../../service/user-service';
import { RoleService } from '../../../service/role-service';

import { Role } from '../../../domain/role';

@Component({
    templateUrl: './user-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class UserDetailView implements OnInit {

    selectedUser: Userng;
    cols: any[];

    roles : Role[];
    
    selectedRoles: Role[];

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
        this.selectedUser = this.userngService.selectedUser;

        this.selectedRoles = this.selectedUser.roles;
    }

    save(): void {
        if(this.userngService.newUser) {
            this.userngService.addUser(this.selectedUser).subscribe(() => this.goBack());  
        } else  {
            this.userngService.updateUser(this.selectedUser).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.userngService.deleteUser(this.selectedUser)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
