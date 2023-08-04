import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import {AccordionComponent} from "./accordion.component";
@NgModule({
    imports: [CommonModule, FormsModule,RouterModule],
    declarations: [AccordionComponent],
    exports: [AccordionComponent, CommonModule, FormsModule]
  })
export class AccordianModule { }
