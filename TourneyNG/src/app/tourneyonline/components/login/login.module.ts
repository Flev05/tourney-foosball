import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { SliderModule } from 'primeng/slider';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BlockUIModule } from 'primeng/blockui';

import {LoginRoutingModule} from './login-routing.module';
import {LoginDetailView} from './login-detailview';
import { ClientLoginListView } from './client-listview';
import { ClientTourneyListView } from './client-tourney-listview';
import { FollowerDetailView } from './follower-detailview';

@NgModule({
	imports: [
        CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,LoginRoutingModule
        ,GrowlModule
        ,PanelModule
        ,DropdownModule
        ,InputTextModule
        ,InputTextareaModule
        ,ButtonModule
        ,TabViewModule
        ,CodeHighlighterModule
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
	]
})
export class LoginModule {}
