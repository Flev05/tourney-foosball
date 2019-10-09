import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule}  from 'primeng/table';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {SpinnerModule} from 'primeng/spinner';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import { GrowlModule } from 'app/components/growl/growl';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import {EliminatoryRoutingModule} from './eliminatory-routing.module';
import { PanelModule } from 'app/components/panel/panel';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { InputTextModule } from 'app/components/inputtext/inputtext';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { ButtonModule } from 'app/components/button/button';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
import { SliderModule } from 'app/components/slider/slider';
import { CalendarModule } from 'app/components/calendar/calendar';
import {StandaloneEliminatoryListView} from './eliminatory-standalone-listview';
import {FullEliminatoryListView} from './eliminatory-full-listview';
import {StandaloneEliminatoryDetailView} from './eliminatory-standalone-detailview';
import { FullEliminatoryDetailView } from './eliminatory-full-detailview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { LevelService } from './level-service';

@NgModule({
	imports: [
		CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,GrowlModule
        ,PanelModule
        ,DropdownModule
        ,InputTextModule
        ,InputTextareaModule
        ,ButtonModule
        ,TabViewModule
        ,CodeHighlighterModule
        ,TableModule
        ,SliderModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,CheckboxModule
        ,SpinnerModule
        ,FieldsetModule
        ,TooltipModule
        ,CalendarModule
        ,EliminatoryRoutingModule
        ,AccordionModule
        ,PickListModule
        ,DialogModule
        ,MessagesModule
        ,MessageModule
    ],
	declarations: [StandaloneEliminatoryListView
        ,FullEliminatoryListView
        ,StandaloneEliminatoryDetailView        
        ,FullEliminatoryDetailView        
    ]
    ,providers: [DateFormatPipe, LevelService]
})
export class EliminatoryModule {}
