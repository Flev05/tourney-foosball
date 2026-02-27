import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractListView } from '../../../components/common/abstract-listview';
import { TourneyService } from '../../../service/tourney-service';
import { Observable, of } from 'rxjs';
import { UserVO } from '../../../domain/user-vo';
import { TableCols } from '../../../domain/table-cols';
import { UserService } from '../../../service/user-service';
import { OperatorsVO } from '../../../domain/operators-vo';
import { ClientService } from '../../../service/client-service';
import { OperatorDetailView } from './operator-detailview';

const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
    templateUrl: './operator-listview.html'
})
export class OperatorListView extends AbstractListView {
    

    cols: TableCols[]  = this.userService.cols;
    rows: any[] = [];
    selectedRow: any;

    selectedOperator: OperatorsVO = new OperatorsVO();
    operators: OperatorsVO[] = [];
    onDeleteOperatorError: boolean = false;

    operatorCols:  TableCols[] = this.tourneyService.operatorCols;

    selectedOperatorRows : UserVO[] = [];
    operatorRows: UserVO[] = [];

    constructor(
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location,
        private userService: UserService,
        protected clientService: ClientService
    ) {
        super(OperatorDetailView.redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.loadOperators();
    }

    onRowSelect(event : any) {
        console.log(event.data);
        this.userService.newUser = false;
        let userId = event.id;
        let found = this.selectedOperatorRows.find( u => u.id == userId );
        if( found ) {
            this.userService.selectedUser = found;
        }
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
            if( this.clientService.selectedClient.id != null ) {
                const observer = this.userService.deleteOperator(uvo.id
                    , this.clientService.selectedClient.id
                    , this.selectedTourney.id
                    , this.loadUsersErrorHandler("Delete operator operation"));
                observer.subscribe(op => this.onDeleteNext(op) );
            }
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
        let op : OperatorsVO = new OperatorsVO();
        op.clientId = selectedClientId;
        op.tourneyId = this.selectedTourney.id;
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

    override goBack(): void {
        this.location.back();
    }
}

