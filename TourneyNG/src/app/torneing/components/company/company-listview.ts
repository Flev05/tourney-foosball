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

    companies: Company[];

    cols: any[];

    constructor(private companyService: CompanyService, public router: Router) { 
        console.log("CompanyListView.constructor()");
    }

    ngOnInit() {
        console.log("CompanyListView.ngOnInit()");

        this.companyService.loadCompanySmall().subscribe(cs => this.companies = cs);

        this.companyService.newCompany = false;

        this.cols = [
            { field: 'firstname',    header: 'Nome' },
            { field: 'lastname',     header: 'Cognome' },
            { field: 'businessName', header: 'Ragione Sociale' },
            { field: 'phoneNumber',  header: 'Telefono' }
        ];
    }

    create() {
        this.selectedCompany={
              firstname: "<Nome Cliente>"
            , lastname: "<Cognome Cliente>"
            , businessName: "<Ragione Sociale>"
            , phoneNumber: "<Numero di cellulare>"
        };
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
        let redirect = '/company/dv';
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
