import { NgModule } from '@angular/core';
 
import { PlayerChooserComponent } from './player-chooser.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [PlayerChooserComponent],
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
    ,CodeHighlighterModule
    ,MessagesModule
    ,MessageModule
    ,TableModule
    ,AutoCompleteModule
  ] 
  , exports: [PlayerChooserComponent]
})
export class PlayerChooserModule { }
