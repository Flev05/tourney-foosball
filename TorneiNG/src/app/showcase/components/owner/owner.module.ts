import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OwnerComponent} from './owner.component';
import {OwnerRoutingModule} from './owner-routing.module';
import {CodeHighlighterModule} from '../../../components/codehighlighter/codehighlighter';

@NgModule({
  imports: [
    CommonModule,
    CodeHighlighterModule,
    OwnerRoutingModule
  ],
  declarations: [
    OwnerComponent
  ]
})
export class OwnerModule {}