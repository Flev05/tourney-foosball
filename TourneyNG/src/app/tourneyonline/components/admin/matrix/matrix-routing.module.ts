import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {MatrixDetailView} from './matrix-detailview';
import { MatrixListView } from './matrix-listview';
import { MatrixTourneyListView } from './tourney-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: MatrixTourneyListView },
			{ path: 'lv',     component: MatrixListView },
			{ path: 'lv/dv',  component: MatrixDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class MatrixRoutingModule {}
