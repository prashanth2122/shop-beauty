import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UniversalInterceptor } from './universal-interceptor';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
//import { ɵangular_packages_platform_server_platform_server_c as ServerStylesHost } from '@angular/platform-server';

/* export class NoRenderServerStylesHost extends ServerStylesHost {
    onStylesAdded(additions: Set<string>): void {
        // super.onStylesAdded(additions);
        // additions.forEach((s) => console.log(s));
        // ignore styles added
    }
} */

@NgModule({
imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule
],
providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: UniversalInterceptor,
    multi: true
}/* ,
{
    provide: ServerStylesHost,
    useClass: NoRenderServerStylesHost
} */],
bootstrap: [AppComponent]
})
export class AppServerModule { }