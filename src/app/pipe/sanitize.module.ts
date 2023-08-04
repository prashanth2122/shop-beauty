import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { SanitizeHtmlPipePipe} from "./sanitize-html-pipe.pipe";
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [SanitizeHtmlPipePipe],
  exports: [
    SanitizeHtmlPipePipe,
    CommonModule,
    FormsModule
  ]
})
export class SanitizeHtmlPipeModule { }
