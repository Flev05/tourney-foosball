import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Classification } from 'app/tourneyonline/domain/classification';

@Component({
    templateUrl: './classification-detailview.html',
})
export class ClassificationDetailView extends AbstractDetailView {
    public static redirect : string = "/classification/dv";
    selectedClassificationRow:  Classification;
    selectedClassificationName: string;
    
    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("ClassificationDetailView.ngOnInit() ");
        this.selectedClassificationRow = this.tourneyService.selectedClassificationRow;
        this.selectedClassificationName = this.tourneyService.getClassificationName();
        super.ngOnInit();
    }
}
