import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {Progress} from './progress';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'',component: Progress}
		])
	],
	exports: [
		RouterModule
	]
})
export class ProgressRoutingModule {}
