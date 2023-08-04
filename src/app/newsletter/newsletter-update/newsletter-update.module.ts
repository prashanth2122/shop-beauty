import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from '@angular/router';
import { NewsletterUpdateComponent } from "./newsletter-update.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NewsletterConfirmationComponent } from '../../newsletter-confirmation/newsletter-confirmation.component';
import { NewsletterUnsubscribeComponent } from '../../newsletter-unsubscribe/newsletter-unsubscribe.component';


const routes: Routes = [
    { path: '', component: NewsletterUpdateComponent,runGuardsAndResolvers: 'always' },
    { path: 'confirmation', component: NewsletterConfirmationComponent},
    { path: 'unsubscribe', component: NewsletterUnsubscribeComponent},
];

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        NewsletterUpdateComponent,
        NewsletterConfirmationComponent,
        NewsletterUnsubscribeComponent 
    ],
    providers:[
    ]
})
export class NewsletterUpdateModule { }