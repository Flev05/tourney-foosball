import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {MatrixDetailView} from './matrix-detailview';
import { TabMatrixListView } from './tab-matrix-listview';
import { MatrixTourneyListView } from './tourney-listview';
import { EliminatoryListView } from './eliminatory-listview';
import { RoundMatrixListView } from './round-matrix-listview';
import { PlayoffMatrixListView } from './playoff-matrix-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: MatrixTourneyListView },
			{ path: 'lv',     component: TabMatrixListView },
			{ path: 'lv/dv',  component: MatrixDetailView },
			{ path: 'lv/roundLv/dv', 	    component: RoundMatrixListView },
			{ path: 'lv/playoffLv/dv', 	    component: PlayoffMatrixListView },
			{ path: 'lv/eliminatoryLv/dv', 	component: EliminatoryListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class MatrixRoutingModule {}
