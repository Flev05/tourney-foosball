import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'

import {UserListView} from './user-listview';
import {UserDetailView} from './user-detailview';

import { UserResetPasswordLv } from './user-reset-password-lv';
import { UserResetPasswordDv } from './user-reset-password-dv';
import { UserChangePassword } from './user-changepassword';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: UserListView },
			{ path: 'userdv', component: UserDetailView },
			{ path: 'resetPasswordLv', component: UserResetPasswordLv },
			{ path: 'resetPasswordDv', component: UserResetPasswordDv },
			{ path: 'changePassword', component: UserChangePassword },
		])
	],
	exports: [
		RouterModule
	]
})
export class UserRoutingModule {}
