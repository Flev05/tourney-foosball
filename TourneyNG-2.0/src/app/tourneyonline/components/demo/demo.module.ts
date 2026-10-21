import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './demo.component';
import {DemoRoutingModule} from './demo-routing.module';
import hljs from 'highlight.js';

@NgModule({
  imports: [
    CommonModule,
    DemoRoutingModule
  ],
  declarations: [
    DemoComponent
  ]
})
export class DemoModule {
  ngAfterViewInit() {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }
}