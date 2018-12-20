import {NgModule}     from '@angular/core';
 
 
 
import { TableResponsiveDemo } from './tableresponsivedemo';
import { ShowcaseRoutingModule } from './showcase-routing.module';
import { CarService } from './carservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SliderModule } from 'app/components/slider/slider';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'app/components/multiselect/multiselect';
import { ContextMenuModule } from 'app/components/contextmenu/contextmenu';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
 
 
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		SliderModule,
		DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
		ButtonModule,
		InputTextModule,
		TabViewModule,
		CodeHighlighterModule
        ,ShowcaseRoutingModule
    ]
    , providers: [
        CarService
    ]
	, declarations: [
        TableResponsiveDemo
	]
})
export class ShowCaseModule {}
