import { NgModule } from '@angular/core';
 
import { TeamMatchesComponent } from './team-matches.component';
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

@NgModule({
  declarations: [TeamMatchesComponent],
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
  , exports: [TeamMatchesComponent]
})
export class TeamMatchesModule { }
