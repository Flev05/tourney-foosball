import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {Realtime} from './realtime';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path:'', component: Realtime}
		])
	],
	exports: [
		RouterModule
	]
})
export class RealtimeRoutingModule {}
