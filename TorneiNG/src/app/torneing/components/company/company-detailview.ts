import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Company } from '../../domain/company';
import { CompanyService } from '../../service/companyservice';

@Component({
    templateUrl: './company-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class CompanyDetailView implements OnInit {

    selectedCompany: Company;

    constructor(
        private route: ActivatedRoute,
        private clientService: CompanyService,
        private location: Location
    ) {}

    ngOnInit() {

        this.getCompany();
    }

    getCompany(): void {
        this.selectedCompany = this.clientService.selectedCompany;
    }

    save(): void {
        if(this.clientService.newCompany) {
            this.clientService.addCompany(this.selectedCompany).subscribe(() => this.goBack());  
        } else  {
            this.clientService.updateCompany(this.selectedCompany).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.clientService.deleteCompany(this.selectedCompany)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
