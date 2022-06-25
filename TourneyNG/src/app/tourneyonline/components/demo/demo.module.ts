import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './demo.component';
import {DemoRoutingModule} from './demo-routing.module';
import {CodeHighlighterModule} from 'primeng/codehighlighter';

@NgModule({
  imports: [
    CommonModule,
    CodeHighlighterModule,
    DemoRoutingModule
  ],
  declarations: [
    DemoComponent
  ]
})
export class DemoModule {}