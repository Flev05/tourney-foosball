import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Observable} from 'rxjs';
import { of } from 'rxjs/observable/of';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { UserRoleClientVO } from 'app/tourneyonline/domain/urc-vo';

const redirect = '/users/urcdv';

@Component({
    templateUrl: './urc-listview.html'
})
export class UrcListView extends AbstractListView {

    cols: TableCols[] ;
    rows: any[];

    urcList: UserRoleClientVO[];

    onLoadUrcError: boolean;
    onDeleteError: boolean;

    constructor(        
            protected tourneyService: TourneyService
          , public urcService: UrcService
          , private loginService: LoginService
          , public router: Router
          , protected location: Location) 
    {        
        super(redirect, tourneyService, router, location);
        console.log("UrcListView.constructor()");
    }

    ngOnInit() {
        console.log("UrcListView.ngOnInit()");

        this.urcService.newUser = false;

        this.cols = [
            { field: 'firstname',   header: 'Nome' },
            { field: 'lastname',    header: 'Cognome' },
            { field: 'phoneNumber', header: 'Telefono' },
            { field: 'client',      header: 'Cliente' },
        ];

        this.onLoadUrcError = false;

        let loggedUserId = this.loginService.userLogged.id;

        let ucrsub = this.urcService.loadUrc(loggedUserId, this.loadClientsErrorHandler('loadUrc()'));
        ucrsub.subscribe(cs => this.urcList = cs, e => this.onError(e), () => this.onComplete());
    }

    private onComplete(): void {
        console.log("onComplete()");

        this.rows = [];
        for( let urcvo of this.urcList ) {
            let row = {id: urcvo.id
                , firstname: urcvo.userVo.firstname
                , lastname: urcvo.userVo.lastname
                , phoneNumber: urcvo.userVo.phoneNumber
                , client: urcvo.clientVO.businessName
            }

            this.rows.push(row);
        }
        this.urcService.urcList = this.urcList; 
    }

    private loadClientsErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onLoadUrcError = true;

            console.log(`${operation} failed!`);

            console.error(error); // log to console instead     
      
            return of(result as T);
        };
    }

    create() {
        this.urcService.newUser = true;
        this.gotoDetailView();
    }

    onRowSelect(event) {
        console.log(event.data);

        let urcId = event.data.id;

        this.urcService.selectedUrc = this.urcList.find( urc => urc.id == urcId );
        this.urcService.newUser = false;

        this.gotoDetailView();
    }

    doDelete(urcvo: UserRoleClientVO) {
        console.log(urcvo);
        let urcId = urcvo.id;
        this.urcService.selectedUrc = this.urcList.find( urc => urc.id == urcId );
       
        let name =  urcvo.userVo.username + "/" + urcvo.clientVO.businessName;
        let popup = 'Sicuro di voler rimuovere la relazione Utente/Cliente: [' + name + "]?";

        this.onDeleteError = false;
        if(confirm(popup)) {

            const subscr = this.urcService.deleteUrc(this.urcService.selectedUrc.id, this.deleteErrorHandler('deleteUser()'));

            subscr.subscribe(n => super.next(n), e => this.onError(e), () => this.onDeleteComplete());
        }
    }
    
    private onDeleteComplete(): void {
        console.log("onDeleteComplete()");

        let index: number = -1;

        for( let i=0; i<this.urcList.length; i++ ) {
            let uvo = this.urcList[i];

            if( uvo.id == this.urcService.selectedUrc.id ) {
                index = i;
                break;
            }
        }

        if(index > -1 ) {
            this.urcList.splice(index, 1);
        }
    }

    private deleteErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            this.onDeleteError = true;
            
            console.log(`${operation} failed!`);

            console.error(error); // log to console instead
      
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    
    onError(e:any) {
        console.log("onError()");
        console.log(e);

        this.onLoadUrcError = true;
    }
 }
