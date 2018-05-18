import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Company } from '../../domain/company';
import { CompanyService } from '../../service/companyservice';

@Component({
    templateUrl: './company-listview.html'
})
export class CompanyListView implements OnInit {

    selectedCompany: Company;

    clients: Company[];

    cols: any[];

    constructor(private companyService: CompanyService, public router: Router) { 
        console.log("CompanyListView.constructor()");
    }

    ngOnInit() {
        console.log("CompanyListView.ngOnInit()");

        this.companyService.loadCompanySmall().subscribe(cs => this.clients = cs);

        this.companyService.newCompany = false;

        this.cols = [
            { field: 'id', header: 'Id' },
            { field: 'name', header: 'Nome' },
            { field: 'when', header: 'Data' },
            { field: 'address', header: 'Indirizzo' }
        ];
    }

    create() {
        this.selectedCompany={id: 0, name: "<Nome Company>", when: "<data inizio torneo>", address: "<indirizzo luogo torneo>"};
        this.companyService.selectedCompany = this.selectedCompany;
        this.companyService.newCompany = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.companyService.selectedCompany = this.cloneCompany(event.data);
        this.companyService.newCompany = false;

        this.gotoDetailView();
    }
  
    private gotoDetailView() {
        let redirect = '/client/dv';
        this.router.navigate([redirect]);
    }

    cloneCompany(c: Company): Company {
        let car = {};
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
}
