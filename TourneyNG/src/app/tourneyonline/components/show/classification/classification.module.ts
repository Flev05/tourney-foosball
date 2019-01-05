import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {OrderListModule} from 'primeng/orderlist';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ClassificationTabListView } from './tab-listview';
import { SliderModule } from 'app/components/slider/slider';
import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { InputTextModule } from 'app/components/inputtext/inputtext';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { ButtonModule } from 'app/components/button/button';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';

import {ClassificationRoutingModule} from './classification-routing.module';
import {ClassificationTourneyListView} from './tourney-listview';
import {AccordionModule} from 'primeng/accordion';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { ClassificationEliminatoryListView } from './eliminatory-listview';

@NgModule({
        imports: [
        CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,AccordionModule
        ,GrowlModule
        ,PanelModule
        ,DropdownModule
        ,InputTextModule
        ,InputTextareaModule
        ,ButtonModule
        ,TabViewModule
        ,CodeHighlighterModule
        ,TableModule
        ,OrderListModule
        ,DialogModule
        ,SliderModule
        ,ClassificationRoutingModule
        ,MessagesModule
        ,MessageModule
	],
	declarations: [
                ClassificationTourneyListView
                ,ClassificationTabListView
                ,ClassificationEliminatoryListView
        ]
        ,providers: [DateFormatPipe]        
})
export class ClassificationModule {}
