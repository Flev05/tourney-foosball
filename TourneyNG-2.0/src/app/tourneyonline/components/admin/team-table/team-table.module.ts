import { NgModule } from '@angular/core';
 
import { TeamTableComponent } from './team-table.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TeamTableComponent],
  imports: [
    CommonModule
    ,FormsModule
    ,ReactiveFormsModule
    ,PanelModule
    ,DropdownModule
    ,InputTextModule
    ,InputTextareaModule
    ,ButtonModule
    ,TableModule
  ], 
  exports: [TeamTableComponent]
})
export class TeamTableModule { }
