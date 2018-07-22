import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import {TourneyRoutingModule} from './tourney-routing.module';
import {GrowlModule} from '../../../../components/growl/growl';
import {PanelModule} from '../../../../components/panel/panel';
import {DropdownModule} from '../../../../components/dropdown/dropdown';
import {InputTextModule} from '../../../../components/inputtext/inputtext';
import {InputTextareaModule} from '../../../../components/inputtextarea/inputtextarea';
import {ButtonModule} from '../../../../components/button/button';
import {TabViewModule} from '../../../../components/tabview/tabview';
import {CodeHighlighterModule} from '../../../../components/codehighlighter/codehighlighter';
import { SliderModule } from '../../../../components/slider/slider';

import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';

import {TourneyListView} from './tourney-listview';
import {TourneyDetailView} from './tourney-detailview';

@NgModule({
	imports: [
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
		TourneyRoutingModule,
        GrowlModule,
        PanelModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule,
        TableModule,
        DialogModule,
        SliderModule,
        RadioButtonModule,
        CheckboxModule
	],
	declarations: [
		TourneyListView,
		TourneyDetailView
	]
})
export class TourneyModule {}
