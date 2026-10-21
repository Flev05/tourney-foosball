import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractView } from './abstract-view';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Injectable } from '@angular/core';
 
@Injectable()
export abstract class AbstractListView extends AbstractView {

    levelMap: Map<number, Eliminatory[]> = new Map<number, Eliminatory[]>();
    totLevelLen: number = 0;

    constructor(protected redirect: string
        , protected override tourneyService: TourneyService
        , protected router: Router
        , protected override location: Location) 
    { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        super.ngOnInit();
    }
    
    onTabChange( value: string | number | undefined ) {
        let index=value;
        console.log("Entering onTabChange(): tab=" + index);
    }
    
    protected gotoDetailView(): void {
        this.router.navigate([this.redirect]);
    }

    protected pow2(level : number) : number {
        return Math.pow(2, level);
    }

    override goBack(): void {
        this.location.back();
    }
    onError(e:any) {
        console.log(e);
    }
}
