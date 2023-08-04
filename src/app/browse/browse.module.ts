import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { FeedbackComponent } from './feedback/feedback.component';
import { browseCustomFocusDirective } from './customfocusDirective/browseCustomFocusDirective';
import { FeedbackFormserviceService } from './feedback-formservice.service'
import {TranslatServicePipeModule} from '../pipe/transalte.module';
import {TranslateServiceSubService} from '../pipe/translate-service-sub.service';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha';
const routes: Routes = [
    { path: '', component: FeedbackComponent, data: { title: 'Customers' } ,
  }
 ];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        TranslatServicePipeModule,
        RecaptchaModule,
        RecaptchaFormsModule
        
    ],
    declarations: [
    browseCustomFocusDirective,
    FeedbackComponent
],
    providers:[
        TranslateServiceSubService,
        FeedbackFormserviceService,
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
              siteKey: '6Le1rMQUAAAAAIGRT2rhKrQ6l6CaXCuUKv5C9L5L',
            } as RecaptchaSettings,
          }
    ]
})
export class BrowseComponentModule { }
