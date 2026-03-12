import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import {RealtimeRoutingModule} from './realtime-routing.module';
import { PanelModule } from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import {Realtime} from './realtime';
import { SelectModule } from 'primeng/select';

@NgModule({
	imports: [
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
		RealtimeRoutingModule,
        PanelModule,
        ToastModule,
        SelectModule,
        InputTextModule,
        ButtonModule,
        TabViewModule,
	],
	declarations: [
		Realtime
	],
    providers: [
        MessageService
    ],
})
export class RealtimeModule {}
