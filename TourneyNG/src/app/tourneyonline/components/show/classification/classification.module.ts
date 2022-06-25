import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import { OrderListModule } from 'primeng/orderlist';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SliderModule } from 'primeng/slider';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { AccordionModule } from 'primeng/accordion';

import { ClassificationTabListView } from './tab-listview';
import { ClassificationRoutingModule } from './classification-routing.module';
import { ClassificationTourneyListView } from './tourney-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { ClassificationEliminatoryListView } from './eliminatory-listview';
import { ClassificationDetailView } from './classification-detailview';

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
                ,ClassificationDetailView
        ]
        ,providers: [DateFormatPipe]        
})
export class ClassificationModule {}
