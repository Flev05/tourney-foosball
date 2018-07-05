import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import {GrowlModule} from '../../../../components/growl/growl';
import {PanelModule} from '../../../../components/panel/panel';
import {DropdownModule} from '../../../../components/dropdown/dropdown';
import {InputTextModule} from '../../../../components/inputtext/inputtext';
import {InputTextareaModule} from '../../../../components/inputtextarea/inputtextarea';
import {ButtonModule} from '../../../../components/button/button';
import {TabViewModule} from '../../../../components/tabview/tabview';
import {CodeHighlighterModule} from '../../../../components/codehighlighter/codehighlighter';
import { SliderModule } from '../../../../components/slider/slider';
import {AutoCompleteModule} from 'primeng/autocomplete';

import {ClientRoutingModule} from './client-routing.module';
import {ClientListView} from './client-listview';
import {ClientDetailView} from './client-detailview';

@NgModule({
	imports: [
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
		ClientRoutingModule,
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
        AutoCompleteModule
	],
	declarations: [
		ClientListView,
		ClientDetailView
	]
})
export class ClientModule {}
