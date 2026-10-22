import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {OperatorDetailView} from './operator-detailview';
import {OperatorListView} from './operator-listview';
import { OperatorPickList } from './operator-picklist';
import { OperatorDetailComponent } from './operator-detail.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '',   component: OperatorListView },
			{ path: 'dv', component: OperatorDetailView },
			// { path: 'dv', component: OperatorDetailComponent },
			{ path: 'pl', component: OperatorPickList },
		])
	],
	exports: [
		RouterModule
	]
})
export class OperatorRoutingModule {}
