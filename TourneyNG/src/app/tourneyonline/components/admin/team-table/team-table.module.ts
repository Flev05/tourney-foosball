import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamTableComponent } from './team-table.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CodeHighlighterModule } from 'primeng/codehighlighter';

@NgModule({
  declarations: [TeamTableComponent],
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
    ,TableModule
  ] 
  , exports: [TeamTableComponent]
})
export class TeamTableModule { }
