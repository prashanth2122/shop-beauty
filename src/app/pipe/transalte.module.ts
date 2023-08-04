import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {TranslatServicePipe} from './translate.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [TranslatServicePipe],
  exports:      [ TranslatServicePipe,
    CommonModule, FormsModule ]
})
export class TranslatServicePipeModule { }