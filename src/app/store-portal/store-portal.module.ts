import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from '@angular/router';
import {StorePortalComponent} from './store-portal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorePortalAuthenticationComponent } from './store-portal-authentication/store-portal-authentication.component';
import { StoreTableComponent } from './store-table/store-table.component';
import { OrderTableComponent } from './order-table/order-table.component';
import {StorePortalService} from './store-portal.service';
const routes: Routes = [
    { path: '', component: StorePortalComponent, data: { title: 'Customers' },
      children:[
            { path: '', redirectTo: 'StorePortal', pathMatch: 'full'},
          {
              path:'StorePortal',
              component:StorePortalAuthenticationComponent
          },
          {
            path:'info_table',
            component:StoreTableComponent
        }
      ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        StorePortalComponent,
        StorePortalAuthenticationComponent,
        StoreTableComponent,
        OrderTableComponent
    ],
    providers:[StorePortalService]
})
export class StorePortalRouteModule { }