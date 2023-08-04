import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from "@angular/forms";
import {StoreLocatorComponent} from './store-locator.component';
// import { AgmCoreModule } from "@agm/core";
@NgModule({
  imports: [
    CommonModule,
    FormsModule
    // AgmCoreModule.forRoot({
    //     apiKey: "gme-moltonbrownltd",
    //     libraries: ["places"]
    //   }),
  ],
  declarations: [StoreLocatorComponent],
  exports:      [ StoreLocatorComponent,
    CommonModule, FormsModule ]
})
export class StoreLocatorModule { }
