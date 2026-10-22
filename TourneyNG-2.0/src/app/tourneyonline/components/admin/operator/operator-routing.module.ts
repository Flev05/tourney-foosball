import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {OperatorDetailView} from './operator-detailview';
import {OperatorListView} from './operator-listview';
import { OperatorPickList } from './operator-picklist';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '',   component: OperatorListView },
			{ path: 'dv', component: OperatorDetailView },
			{ path: 'pl', component: OperatorPickList },
		])
	],
	exports: [
		RouterModule
	]
})
export class OperatorRoutingModule {}
