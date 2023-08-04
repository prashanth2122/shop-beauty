import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {CustomFormFocusDirective} from './customfocus.directive';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [CustomFormFocusDirective],
  exports:      [ CustomFormFocusDirective,
    CommonModule, FormsModule ]
})
export class CustomFocusControlDirectiveModule { }