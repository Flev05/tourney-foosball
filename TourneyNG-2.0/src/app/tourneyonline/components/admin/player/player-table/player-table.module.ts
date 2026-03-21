import { NgModule } from '@angular/core';
 
import { PlayerTableComponent } from './player-table.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [PlayerTableComponent],
  imports: [
    CommonModule
    ,FormsModule
    ,ReactiveFormsModule
    ,PanelModule
    ,SelectModule
    ,InputTextModule
    ,ButtonModule
    ,ToastModule
    ,MessageModule
    ,TableModule
  ] 
  , exports: [PlayerTableComponent]
})
export class PlayerTableModule { }
