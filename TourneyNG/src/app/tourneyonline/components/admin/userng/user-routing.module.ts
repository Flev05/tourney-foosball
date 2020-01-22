import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'

import { UserResetPasswordLv } from './user-reset-password-lv';
import { UserResetPasswordDv } from './user-reset-password-dv';
import { UserChangePassword } from './user-changepassword';
import { UrcListView } from './urc-listview';
import { UrcDetailView } from './urc-detailview';
import { UserListView } from './user-listview';
import { UserDetailView } from './user-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', 				component: UrcListView },
			{ path: 'ueserlv', 			component: UserListView },
			{ path: 'ueserdv', 			component: UserDetailView },
			{ path: 'urcdv', 			component: UrcDetailView },
			{ path: 'resetPasswordLv', 	component: UserResetPasswordLv },
			{ path: 'resetPasswordDv', 	component: UserResetPasswordDv },
			{ path: 'changePassword', 	component: UserChangePassword },
		])
	],
	exports: [
		RouterModule
	]
})
export class UserRoutingModule {}
