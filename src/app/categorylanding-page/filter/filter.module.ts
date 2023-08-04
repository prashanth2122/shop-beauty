import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FilterComponent } from "./filter.component";
import {AccordianModule} from "../../accordion/accordian.module";
import {AccordianItemModule} from "../../accordion-item/accordion-item.module";
import {TranslatServicePipeModule} from '../../pipe/transalte.module';
import {TranslateServiceSubService} from '../../pipe/translate-service-sub.service';
@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    AccordianModule,
    TranslatServicePipeModule,
    AccordianItemModule
  ],
  declarations: [FilterComponent],
  exports: [
    FilterComponent, 
    CommonModule, 
    FormsModule
  ],
    providers:[TranslateServiceSubService]
})
export class FilterModule {}
