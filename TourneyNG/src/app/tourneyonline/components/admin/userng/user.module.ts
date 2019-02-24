import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { SliderModule } from 'app/components/slider/slider';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
import { TabViewModule } from 'app/components/tabview/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import { UserRoutingModule } from './user-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FieldsetModule } from 'primeng/fieldset';

import {UserListView} from './user-listview';
import {UserDetailView} from './user-detailview';
import {UserChangePassword} from './user-changepassword';
import {UserResetPasswordLv} from './user-reset-password-lv';
import {UserResetPasswordDv} from './user-reset-password-dv';
@NgModule({
	imports: [
        CommonModule
        ,FormsModule
        ,ReactiveFormsModule
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
        ,RadioButtonModule
        ,FieldsetModule
        ,AccordionModule
        ,MessagesModule
        ,MessageModule
		,UserRoutingModule
	],
	declarations: [UserListView,
		UserDetailView,
        UserChangePassword,
        UserResetPasswordLv,
        UserResetPasswordDv
	]
})
export class UserModule {}
