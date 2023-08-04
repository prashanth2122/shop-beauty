import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import {AccordionItemComponent} from "./accordion-item.component";
@NgModule({
    imports: [CommonModule, FormsModule,RouterModule],
    declarations: [AccordionItemComponent],
    exports: [AccordionItemComponent, CommonModule, FormsModule]
  })
export class AccordianItemModule { }
