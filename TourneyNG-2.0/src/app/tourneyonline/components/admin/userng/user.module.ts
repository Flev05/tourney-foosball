import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SliderModule } from 'primeng/slider';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FieldsetModule } from 'primeng/fieldset';
import { UserRoutingModule } from './user-routing.module';
import {UserChangePassword} from './user-changepassword';
import {UserResetPasswordLv} from './user-reset-password-lv';
import {UserResetPasswordDv} from './user-reset-password-dv';
import { UrcListView } from './urc-listview';
import { UserDetailView } from './user-detailview';
import { UserListView } from './user-listview';
import { SelectModule } from 'primeng/select';

@NgModule({
	imports: [
        CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,PanelModule
        ,SelectModule
        ,InputTextModule
        ,ButtonModule
        ,TabViewModule
        ,TableModule
        ,DialogModule
        ,SliderModule
        ,ToastModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,FieldsetModule
        ,AccordionModule
        ,MessagesModule
        ,MessageModule
        ,UserRoutingModule
	],
	declarations: [
                UrcListView
                , UserDetailView
                , UserListView
                , UserChangePassword
                , UserResetPasswordLv
                , UserResetPasswordDv
	],
    providers: [
        MessageService
    ],
})
export class UserModule {}
