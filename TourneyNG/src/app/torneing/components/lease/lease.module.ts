import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import {LeaseComponent} from './lease.component';
import {LeaseRoutingModule} from './lease-routing.module';
import {GrowlModule} from '../../../components/growl/growl';
import {PanelModule} from '../../../components/panel/panel';
import {DropdownModule} from '../../../components/dropdown/dropdown';
import {InputTextModule} from '../../../components/inputtext/inputtext';
import {InputTextareaModule} from '../../../components/inputtextarea/inputtextarea';
import {ButtonModule} from '../../../components/button/button';
import {TabViewModule} from '../../../components/tabview/tabview';
import {CodeHighlighterModule} from '../../../components/codehighlighter/codehighlighter';

@NgModule({
  imports: [
    CommonModule,
    CodeHighlighterModule,
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
    LeaseRoutingModule
  ],
  declarations: [
    LeaseComponent
  ]
})
export class LeaseModule {}