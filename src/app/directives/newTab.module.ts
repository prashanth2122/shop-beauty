import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {OpenLinkInNewWindowDirective} from './newtabDirective.directive';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [OpenLinkInNewWindowDirective],
  exports:      [ OpenLinkInNewWindowDirective,
    CommonModule, FormsModule ]
})
export class OpenNewWindowModule { }