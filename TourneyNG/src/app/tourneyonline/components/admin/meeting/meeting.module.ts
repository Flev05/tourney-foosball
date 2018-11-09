import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule}    from '@angular/forms';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SpinnerModule} from 'primeng/spinner';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';

import {MeetingRoutingModule} from './meeting-routing.module';
import {GrowlModule} from '../../../../components/growl/growl';
import {PanelModule} from '../../../../components/panel/panel';
import {DropdownModule} from '../../../../components/dropdown/dropdown';
import {InputTextModule} from '../../../../components/inputtext/inputtext';
import {InputTextareaModule} from '../../../../components/inputtextarea/inputtextarea';
import {ButtonModule} from '../../../../components/button/button';
import {TabViewModule} from '../../../../components/tabview/tabview';
import {CodeHighlighterModule} from '../../../../components/codehighlighter/codehighlighter';
import {SliderModule} from '../../../../components/slider/slider';

import {CalendarModule} from '../../../../components/calendar/calendar';

import {CalendarTourneyListView } from './tourney-listview';
import { MeetingListView } from './meeting-listview';
import { MeetingDetailView } from './meeting-detailview';
import { AllMeetingListView } from './all-meeting-listview';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

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
        ,DialogModule
        ,SliderModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,CheckboxModule
        ,SpinnerModule
        ,FieldsetModule
        ,TooltipModule
        ,CalendarModule
        ,MeetingRoutingModule
        ,AccordionModule
        ,PickListModule
        ,MessagesModule
        ,MessageModule
    ],
	declarations: [
		CalendarTourneyListView
        ,AllMeetingListView
        ,MeetingListView
        ,MeetingDetailView
	]
})
export class AdminMeetingModule {}
