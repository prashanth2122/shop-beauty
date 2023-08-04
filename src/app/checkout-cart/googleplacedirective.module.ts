import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { GooglePlacesDirective } from './googlePlace.directive';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [GooglePlacesDirective],
  exports: [
    GooglePlacesDirective,
    CommonModule,
    FormsModule
  ]
})
export class GooglePlacesDirectiveModule { }
