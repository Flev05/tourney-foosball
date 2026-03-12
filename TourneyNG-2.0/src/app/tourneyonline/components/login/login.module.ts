import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from 'primeng/slider';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BlockUIModule } from 'primeng/blockui';

import {LoginRoutingModule} from './login-routing.module';
import {LoginDetailView} from './login-detailview';
import { ClientLoginListView } from './client-listview';
import { ClientTourneyListView } from './client-tourney-listview';
import { FollowerDetailView } from './follower-detailview';
import { SelectModule } from 'primeng/select';

@NgModule({
	imports: [
        CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,LoginRoutingModule
        ,ToastModule
        ,PanelModule
        ,SelectModule
        ,InputTextModule
        ,ButtonModule
        ,TabViewModule
        ,TableModule
        ,DialogModule
        ,SliderModule
        ,AutoCompleteModule
        ,AccordionModule
        ,MessagesModule
        ,MessageModule
        ,BlockUIModule
	],
	declarations: [
                  LoginDetailView
                , ClientLoginListView
                , ClientTourneyListView
                , FollowerDetailView
	],
        providers: [MessageService]
})
export class LoginModule {}
