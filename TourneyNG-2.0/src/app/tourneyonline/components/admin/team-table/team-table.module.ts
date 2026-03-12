import { NgModule } from '@angular/core';
 
import { TeamTableComponent } from './team-table.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

@NgModule({
  declarations: [TeamTableComponent],
  imports: [
    CommonModule
    ,FormsModule
    ,ReactiveFormsModule
    ,PanelModule
    ,SelectModule
    ,InputTextModule
    ,ButtonModule
    ,TableModule
  ], 
  exports: [TeamTableComponent]
})
export class TeamTableModule { }
