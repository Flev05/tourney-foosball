import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import {LeaseComponent} from './lease.component';
import {LeaseRoutingModule} from './lease-routing.module';
import {GrowlModule} from 'primeng/growl';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {CodeHighlighterModule} from 'primeng/codehighlighter';

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