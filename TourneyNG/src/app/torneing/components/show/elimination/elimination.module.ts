import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';

import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';

import {EliminationRoutingModule} from './elimination-routing.module';
import {GrowlModule} from '../../../../components/growl/growl';
import {PanelModule} from '../../../../components/panel/panel';
import {DropdownModule} from '../../../../components/dropdown/dropdown';
import {InputTextModule} from '../../../../components/inputtext/inputtext';
import {InputTextareaModule} from '../../../../components/inputtextarea/inputtextarea';
import {ButtonModule} from '../../../../components/button/button';
import {TabViewModule} from '../../../../components/tabview/tabview';
import {CodeHighlighterModule} from '../../../../components/codehighlighter/codehighlighter';
import {SliderModule} from '../../../../components/slider/slider';

import {EliminationTourneyListView} from './tourney-listview';
import {EliminationListView} from './elimination-listview';

@NgModule({
	imports: [
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GrowlModule,
        PanelModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule,
        TableModule,
        OrderListModule,
        DialogModule,
        SliderModule,
        EliminationRoutingModule,
        OrganizationChartModule,
	],
	declarations: [
		EliminationTourneyListView,
		EliminationListView
	]
})
export class EliminationModule {}
