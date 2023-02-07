import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Router } from '@angular/router';
import { UserService } from 'app/tourneyonline/service/user-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Observable, of } from 'rxjs';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { OperatorListView } from './operator-listview';
import { OperatorsVO } from 'app/tourneyonline/domain/operators-vo';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { OperatorDetailView } from './operator-detailview';

@Component({
    templateUrl: './operator-picklist.html'
})
export class OperatorPickList extends AbstractListView {
    availableOperators: string[];
    targetOperators: string[];
    returnLabel: string;
    operatorVo: OperatorsVO;
    
    constructor( protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private userService: UserService
        , public urcService: UrcService
        , private clientService: ClientService) 
    { 
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        console.log("OperatorPickList.ngOnInit() ");
        super.ngOnInit();

        this.returnLabel = "Indietro";
        this.prepareAvailableOperators();
    }
    
    private prepareAvailableOperators(): void {
        this.targetOperators = [];
        for(let op of this.tourneyService.operatorVo.selectedOperators) {
            this.targetOperators.push(op.username);
        }
        
        this.availableOperators = [];
        for(let op of this.tourneyService.operatorVo.allOperators) {
            let tn = this.targetOperators.find(x => x == op.username);
            if( tn == undefined) {
                this.availableOperators.push(op.username);
            }
        }
    }

    onMoveToTarget(event) {
        console.log("Entering onMoveToTarget()");
        this.returnLabel = "Salva e torna";
        this.userService.isOperatorChanged=true;
        this.mergeOperators();
    }

    onMoveToSource(event) {
        console.log("Entering onMoveToSource()");
        this.returnLabel = "Salva e torna";
        this.userService.isOperatorChanged=true;
        this.mergeOperators();
    }
 
    newOperator() {
        this.userService.newUser = true;
        this.returnLabel = "Salva e torna";
        
        this.router.navigate([OperatorDetailView.redirect]);
    }
    
    /**
     * Before to return to the previous page, verifies if we added o removed some teams
     * and, if so, align all the teams list in the tourney
     */
    goBack(): void {
        this.afterMerge();
    }  

    private afterMerge() {
        let tvo: TourneyVO = {
            id: this.selectedTourney.id,
            tourneyName: this.selectedTourney.tourneyName,
            country: this.selectedTourney.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(this.selectedTourney)
        };
        const subscriber = this.tourneyService.saveTourney(tvo,  this.saveTourneyErrorHandler("Operator update failed"));
        subscriber.subscribe(cs => this.nextAndGoBack(cs));
    }

    private nextAndGoBack(n:any) {
        console.log("next()");
        console.log(n);
        super.goBack();
    }

    private mergeOperators() {
        let toList : UserVO[] = [];
        for (let tn of this.targetOperators) {
            let op: UserVO = this.tourneyService.operatorVo.allOperators.find(x => x.username == tn);
            if( op == undefined || op == null) {
                continue;
            }
            toList.push(op);
        }       
        this.tourneyService.operatorVo.selectedOperators = toList;

        let op : OperatorsVO = this.tourneyService.operatorVo;
        const subscriber = this.urcService.mergeOperators(op, this.loadUsersErrorHandler('mergeOperators()'));
        subscriber.subscribe(cs => this.next(cs), e => this.onError(e) );
    }
 
    private loadUsersErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {      
            console.log(`${operation} failed`);
            console.error(error);     
            return of(result as T);
        };
    }
    
    protected saveTourneyErrorHandler<T> (operation = 'operation', result?: T): any {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                return of(result as T);
            } 
            if( res.error.errorCode == "TourneyAlreadyExists" ) {
                return of(result as T);
            }
      
            return of(result as T);
        };
    }
}
