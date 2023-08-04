import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PagerComponent } from "./pager.component";

import {TranslatServicePipeModule} from '../.././pipe/transalte.module';
import { TranslateServiceSubService } from "./../../pipe/translate-service-sub.service";
@NgModule({
  imports: [CommonModule, FormsModule,TranslatServicePipeModule],
  declarations: [PagerComponent],
  exports: [PagerComponent, CommonModule, FormsModule],
  providers:[TranslateServiceSubService]
})
export class PageTypeModule {}
