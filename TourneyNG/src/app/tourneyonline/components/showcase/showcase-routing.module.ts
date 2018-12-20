import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import { TableResponsiveDemo } from './tableresponsivedemo';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: TableResponsiveDemo },
		])
	],
	exports: [
		RouterModule
	]
})
export class ShowcaseRoutingModule {}
