import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {Login} from './login';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'',component: Login}
		])
	],
	exports: [
		RouterModule
	]
})
export class LoginRoutingModule {}
