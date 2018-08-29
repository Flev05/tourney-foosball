import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {LoginDetailView} from './login-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: LoginDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class LoginRoutingModule {}
