import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {DisableControlDirective} from './disableFieldDirective.directive';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [DisableControlDirective],
  exports:      [ DisableControlDirective,
    CommonModule, FormsModule ]
})
export class DisableControlDirectiveModule { }