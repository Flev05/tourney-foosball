import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import { OrderListModule } from 'primeng/orderlist';
import { MessageModule } from 'primeng/message';
import { SliderModule } from 'primeng/slider';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';

import { ClassificationTabListView } from './tab-listview';
import { ClassificationRoutingModule } from './classification-routing.module';
import { ClassificationTourneyListView } from './tourney-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { ClassificationEliminatoryListView } from './eliminatory-listview';
import { ClassificationDetailView } from './classification-detailview';
import { PlayerTableModule } from '../../admin/player/player-table/player-table.module';
import { TeamMatchesModule } from '../match/team-matches/team-matches.module';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

@NgModule({
        imports: [
        CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,AccordionModule
        ,PanelModule
        ,SelectModule
        ,InputTextModule
        ,ButtonModule
        ,TabsModule
        ,TableModule
        ,OrderListModule
        ,DialogModule
        ,SliderModule
        ,ClassificationRoutingModule
        ,ToastModule 
        ,MessageModule
        ,PlayerTableModule
        ,TeamMatchesModule
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
