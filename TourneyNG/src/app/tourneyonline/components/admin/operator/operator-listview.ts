import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Observable, of } from 'rxjs';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { UserService } from 'app/tourneyonline/service/user-service';
import { OperatorsVO } from 'app/tourneyonline/domain/operators-vo';
import { ClientService } from 'app/tourneyonline/service/client-service';

const REDIRECT_TOURNEY_LV   = 'admintourney/';
const REDIRECT_TOURNEY_DV   = 'adminoperator/dv';

@Component({
    templateUrl: './operator-listview.html'
})
export class OperatorListView extends AbstractListView {
    public static redirect: string = REDIRECT_TOURNEY_DV;

    cols: TableCols[]  = this.userService.cols;
    rows: any[];
    selectedRow: any;

    selectedOperator: OperatorsVO;
    operators: OperatorsVO[];
    onDeleteOperatorError: boolean;

    operatorCols:  TableCols[] = this.tourneyService.operatorCols;

    selectedOperatorRows : UserVO[];
    operatorRows: UserVO[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        private userService: UserService,
        protected clientService: ClientService
    ) {
        super(OperatorListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadOperators();
    }

    onRowSelect(event) {
        console.log(event.data);
        this.userService.newUser = false;
        let userId = event.id;
        this.userService.selectedUser = this.selectedOperatorRows.find( u => u.id == userId );
        this.router.navigate([this.redirect]);
    }

    create() {
        this.userService.newUser = true;
        this.gotoDetailView();
    }

    deleteOperator(uvo: UserVO) {
        console.log("deleteOperator(): " + uvo.username);
        let popup = "Sicuro di voler rimuovere l'operatore: " + uvo.username + "?";

        if(confirm(popup)) {
            const observer = this.userService.deleteOperator(uvo.id
                , this.clientService.selectedClient.id
                , this.selectedTourney.id
                , this.loadUsersErrorHandler("Delete operator operation"));
            observer.subscribe(op => this.onDeleteNext(op) );
        }
    }

    private onDeleteNext(op : UserVO): any {
        if( op == undefined ) {
            return;
        }
        let deletedOp = this.operatorRows.find( t => t.username == op.username );
        if( deletedOp != undefined ) {
            let index: number = this.operatorRows.indexOf(deletedOp);
            if(index > -1) {
                this.operatorRows.splice(index, 1);
            }
        }
        deletedOp = this.selectedOperatorRows.find( t => t.username == op.username );
        if( deletedOp != undefined ) {
            let index: number = this.selectedOperatorRows.indexOf(deletedOp);
            if(index > -1) {
                this.selectedOperatorRows.splice(index, 1);
            }
        }
    }
 
    private loadOperators() {
        let selectedClientId = this.clientService.selectedClient.id;
        let op : OperatorsVO = {clientId: selectedClientId, tourneyId: this.selectedTourney.id};
        const subscriber = this.userService.loadOperatorsBy(op, this.loadUsersErrorHandler('loadAllOperators()'));
        subscriber.subscribe(cs => this.onLoadNext(cs), e => this.onError(e) );
    }

    private onLoadNext(op: OperatorsVO): void {
        this.operatorRows = op.allOperators;
        this.selectedOperatorRows = op.selectedOperators;
    }

    private loadUsersErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {      
            console.log(`${operation} failed`);
            console.error(error);     
            return of(result as T);
        };
    }

/*     private mergeOperators() {
        let selectedClientId = this.clientService.selectedClient.id;
        let op : UserVO = {clientId: selectedClientId, tourneyId: this.selectedTourney.id};
        op.allOperators = this.operatorRows;
        op.selectedOperators = this.selectedOperatorRows;
        const subscriber = this.userService.mergeOperators(op, this.loadUsersErrorHandler('mergeOperators()'));
        subscriber.subscribe(cs => this.onMergeNext(cs), e => this.onError(e) );
    } */

/*     private onMergeNext(cs: UserVO): void {
        this.onLoadNext(cs);
        this.gotoListView();
    } */
    
    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV]);
    }

    goBack(): void {
        this.location.back();
    }
}

