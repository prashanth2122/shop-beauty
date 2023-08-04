import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {SortTypeComponent} from './sort-type.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [SortTypeComponent],
  exports:      [ SortTypeComponent,CommonModule, FormsModule ]
})
export class sortTypeModule { }
