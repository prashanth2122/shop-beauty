import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "./header.component";
import {HeaderSubmenuComponent} from '../header-submenu/header-submenu.component';
import{MenuComponent} from '../menu/menu.component';
import { CartComponent } from './cart/cart.component';
import {SanitizeHtmlPipeModule} from "../../pipe/sanitize.module";
import {OpenNewWindowModule} from "../../directives/newTab.module";
import {TranslatServicePipeModule} from '../.././pipe/transalte.module';
import { TranslateServiceSubService } from "./../../pipe/translate-service-sub.service";
@NgModule({
  imports: [CommonModule, FormsModule,ReactiveFormsModule,
    TranslatServicePipeModule,RouterModule,SanitizeHtmlPipeModule,OpenNewWindowModule],
    providers:[TranslateServiceSubService],
  declarations: [HeaderComponent,HeaderSubmenuComponent,CartComponent,MenuComponent],
  exports: [HeaderComponent,HeaderSubmenuComponent,CartComponent,MenuComponent, CommonModule, FormsModule]
})
export class HeaderModule {}