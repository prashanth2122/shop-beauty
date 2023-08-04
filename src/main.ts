import { enableProdMode,Injector } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export let appInjector: Injector;
if (environment.production) {
  enableProdMode();
}


  // platformBrowserDynamic().bootstrapModule(AppModule)
        // if (window['componentRef']) {
      //   window['componentRef'].destroy();
      // }
      // window['componentRef'] = componentRef;
document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
});
