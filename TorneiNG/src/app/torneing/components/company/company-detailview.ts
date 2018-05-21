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
        private companyService: CompanyService,
        private location: Location
    ) {}

    ngOnInit() {

        this.getCompany();
    }

    getCompany(): void {
        this.selectedCompany = this.companyService.selectedCompany;
    }

    save(): void {
        if(this.companyService.newCompany) {
            this.companyService.addCompany(this.selectedCompany).subscribe(() => this.goBack());  
        } else  {
            this.companyService.updateCompany(this.selectedCompany).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.companyService.deleteCompany(this.selectedCompany)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
