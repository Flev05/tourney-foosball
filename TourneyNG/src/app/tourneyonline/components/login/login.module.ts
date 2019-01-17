import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { InputTextModule } from 'app/components/inputtext/inputtext';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { ButtonModule } from 'app/components/button/button';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
import { SliderModule } from 'app/components/slider/slider';

import {LoginRoutingModule} from './login-routing.module';
import {LoginDetailView} from './login-detailview';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

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
	],
	declarations: [
                LoginDetailView,
	]
})
export class LoginModule {}
