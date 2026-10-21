import { NgModule } from '@angular/core';
 
import { PlayerChooserComponent } from './player-chooser.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [PlayerChooserComponent],
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
    ,AutoCompleteModule
  ] 
  , exports: [PlayerChooserComponent]
})
export class PlayerChooserModule { }
