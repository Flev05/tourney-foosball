import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import {GrowlModule} from '../../../../components/growl/growl';
import {PanelModule} from '../../../../components/panel/panel';
import {DropdownModule} from '../../../../components/dropdown/dropdown';
import {InputTextModule} from '../../../../components/inputtext/inputtext';
import {InputTextareaModule} from '../../../../components/inputtextarea/inputtextarea';
import {ButtonModule} from '../../../../components/button/button';
import {TabViewModule} from '../../../../components/tabview/tabview';
import {CodeHighlighterModule} from '../../../../components/codehighlighter/codehighlighter';
import { SliderModule } from '../../../../components/slider/slider';

import {UserRoutingModule} from './user-routing.module';
import {UserListView} from './user-listview';
import {UserDetailView} from './user-detailview';
import {UserChangePassword} from './user-changepassword';
import {UserResetPasswordLv} from './user-reset-password-lv';
import {UserResetPasswordDv} from './user-reset-password-dv';

@NgModule({
	imports: [
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
		UserRoutingModule,
        GrowlModule,
        PanelModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule,
        TableModule,
        DialogModule,
        SliderModule,
	],
	declarations: [
		UserListView,
		UserDetailView,
        UserChangePassword,
        UserResetPasswordLv,
        UserResetPasswordDv,
	]
})
export class UserModule {}
