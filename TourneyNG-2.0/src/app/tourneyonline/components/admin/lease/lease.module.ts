import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import {LeaseComponent} from './lease.component';
import {LeaseRoutingModule} from './lease-routing.module';
import {PanelModule} from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    TabsModule,
    LeaseRoutingModule,
    ToastModule
  ],
  declarations: [
    LeaseComponent
  ],
  providers: [MessageService]
})
export class LeaseModule {}