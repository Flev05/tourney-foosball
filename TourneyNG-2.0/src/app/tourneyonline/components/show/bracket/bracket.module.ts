import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import { TennisBracketComponent } from './TennisBracketComponent';

@NgModule({
    declarations: [TennisBracketComponent],
	imports: [
		CommonModule
    ],
    exports: [TennisBracketComponent]
})
export class BracketModule {}
