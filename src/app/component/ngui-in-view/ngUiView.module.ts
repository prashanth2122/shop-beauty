import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {NguiInViewComponent} from './ngui-in-view.component';
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [NguiInViewComponent],
  exports: [NguiInViewComponent, CommonModule, FormsModule]
})
export class NgUiViewModule {}
